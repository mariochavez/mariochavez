---
layout: post
title: Full-text search with SQLite and Rails
date: 2023-09-01 00:00:00 -0600
published: Septiembre 1, 2023
categories: desarrollo
description: Integrate SQLite fts5 extension for Full-text search in Ruby on Rails applications.
keywords: ruby on rails, sqlite, web applications, full-text
image: /images/full-text-search/full-text-search.jpg
lang: en
---

Today, I planned to move a few small Ruby on Rails applications with Heroku using [Kamal](https://kamal-deploy.org/) onto a single server. All applications use PostgreSQL as the database because it is simple to use with Heroku and because they take advantage of Postgres' full-text search.

Because of the size and usage of those applications, I was not convinced that I wanted to manage my own PostgreSQL server or pay for a managed service. So, I started to consider replacing the database with [SQLite](https://www.sqlite.org/index.html). At least in my feed at [X](https://x.com/mario_chavez), I have seen so many posts in the past few months on how good and fast it is.

I wanted something like the [pg_search](https://github.com/Casecommons/pg_search#pg_search_scope) gem, where I could define a scope name and the fields to be indexed. On the SQLite side, I found that it has an extension called [FTS5](https://www.sqlite.org/fts5.html), which is defined as:

> FTS5 is an SQLite [virtual table module](https://www.sqlite.org/c3ref/module.html) that provides [full-text search](https://en.wikipedia.org/wiki/Full_text_search) functionality to database applications. In their most elementary form, full-text search engines allow the user to efficiently search a large collection of documents for the subset that contains one or more instances of a search term. The search functionality provided to World Wide Web users by Google is, among other things, a full-text search engine, as it allows users to search for all documents on the web that contain, for example, the term "fts5".
>

This looked promising, so I started implementing a quick and dirty solution for my needs.
Starting from a model Post with title and content attributes, I want to define a `full_search` scope and indicate the attributes to index for full-text search.

Something like this:

```ruby
class Post < ApplicationRecord
  include SqliteSearch

  search_scope(:title, :content)
end
```

Where `SqliteSearch` is the module that does the heavy work. Before continuing with the implementation, there are decisions to be made regarding how to store the indexed data in the database. A virtual table is required to store the indexed data; one option is to create a single table for this purpose with a `record_type` and `record_id` fields to identify the data per model type, just like the way it works for ActiveStorage or ActionText in Rails.

The second option is to create a table per indexed model. I chose this option since not all my models require this functionality. The migration for this table is as follows:

```ruby
class PostSearch < ActiveRecord::Migration[7.0]
  def up
    execute("CREATE VIRTUAL TABLE fts_posts USING fts5(title, content, post_id)")
  end

  def down
    execute("DROP TABLE IF EXISTS fts_posts")
  end
end
```

The table name follows the Rails convention, but it adds the prefix `fts_`. The table fields are the ones that need indexing with the addition of the original record id with the foreign key convention. SQLite virtual tables don't have data types, primary keys, constraints, or indexes.

The `SqliteSearch` module needs to implement a way to add or update the model data to the search index. This is done using the **ActiveRecord** callbacks for save and destroy commit.

```ruby
module SqliteSearch
  extend ActiveSupport::Concern

  private def update_search_index
    primary_key = self.class.primary_key
    table_name = self.class.table_name
    foreign_key = self.class.to_s.foreign_key

    search_attrs = @@search_scope_attrs.each_with_object({}) { |attr, acc|
      acc[attr] = quote_string(send(attr) || "")
    }
    id_value = attributes[primary_key]

    sql_delete = <<~SQL.strip
      DELETE FROM fts_#{table_name} WHERE #{foreign_key} = #{id_value};
    SQL
    self.class.connection.execute(sql_delete)

    sql_insert = <<~SQL.strip
      INSERT INTO fts_#{table_name}(#{search_attrs.keys.join(", ")}, #{foreign_key})
      VALUES (#{search_attrs.values.map { |value| "'#{value}'" }.join(", ")}, #{attributes[primary_key]});
    SQL
    self.class.connection.execute(sql_insert)
  end

  private def delete_search_index
    primary_key = self.class.primary_key
    table_name = self.class.table_name
    foreign_key = self.class.to_s.foreign_key
    id_value = attributes[primary_key]

    sql_delete = <<~SQL.strip
      DELETE FROM fts_#{table_name} WHERE #{foreign_key} = #{id_value};
    SQL
    self.class.connection.execute(sql_delete)
  end

  included do
    after_save_commit :update_search_index
    after_destroy_commit :delete_search_index

    scope_foreign_key = to_s.foreign_key
    scope :full_search, ->(query) {
      return none if query.blank?

      sql = <<~SQL.strip
        SELECT #{scope_foreign_key} AS id FROM fts_#{table_name}
        WHERE fts_#{table_name} = '#{query}' ORDER BY rank;
      SQL
      ids = connection.execute(sql).map(&:values).flatten
      where(id: ids)
    }
  end

  class_methods do
    def search_scope(*attrs)
      @@search_scope_attrs = attrs
    end

    def rebuild_search_index(*ids)
      target_ids = Array(ids)
      target_ids = self.ids if target_ids.empty?

      scope_foreign_key = to_s.foreign_key

      delete_where = Array(ids).any? ? "WHERE #{scope_foreign_key} IN (#{ids.join(", ")})" : ""
      sql_delete = <<~SQL.strip
        DELETE FROM fts_#{table_name} #{delete_where};
      SQL
      connection.execute(sql_delete)

      target_ids.each do |id|
        record = where(id: id).pluck(*@@search_scope_attrs, :id).first
        if record.present?
          id = record.pop

          sql_insert = <<~SQL.strip
            INSERT INTO fts_#{table_name}(#{@@search_scope_attrs.join(", ")}, #{scope_foreign_key})
            VALUES (#{record.map { |value| "'#{quote_string(value)}'" }.join(", ")}, #{id});
          SQL
          connection.execute(sql_insert)
        end
      end
    end

    def quote_string(s)
      s.gsub("\\", '\&\&').gsub("'", "''")
    end
  end
end
```

The class method `search_scope` tells the module the attributes we need to index. The `update_search_index` callback is called when the record is created or updated. Since SQLite, virtual tables don't support upsert, which is a way to tell the database to insert a record if it doesn't exist or to update it if it does. Also, the Rails SQLite adapter does not support multiple statements in a single execution call. 

These limitations forced me to make two additional database calls: the first to delete the indexed data for a specific record, and the second to insert the new indexed data. It's not very performant, but for a small database, it might be just fine.
The `delete_search_index` callback removes the indexed data when a record is deleted.

The module also implements a class method, `rebuild_search_index`, which optionally receives an array of record ids to re-index. If no ids are passed, then it rebuilds the index for all records.

Finally, a scope full_search is added to fetch records based on the full-text search index. You can use keywords like "AND", "OR," or "NOT" to refine your search or any other special character supported by SQLite FTS5.

```ruby
Post.full_search("Ruby OR Rails NOT Javascript")
```

## Conclusion

Adding this module to my applications allowed me to explore the idea of moving from PostgreSQL for these small applications. Not because PostgreSQL is bad, but because it might be too much for the current application's needs.
