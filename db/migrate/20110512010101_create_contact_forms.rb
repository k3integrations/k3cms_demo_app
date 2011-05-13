class CreateContactForms < ActiveRecord::Migration
  def self.up
    create_table :k3cms_contact_forms do |t|
      t.string :title
      t.string :header
      t.string :recipient_email
      t.boolean :show_subject_field, :default => true
      t.belongs_to :page
      t.belongs_to :author

      t.timestamps
    end
  end

  def self.down
    drop_table :k3cms_contact_forms
  end
end
