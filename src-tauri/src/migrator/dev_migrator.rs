use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PageContentMigrator {
    pub doctype: String,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PageEntryMigrator {
    pub __id: String,
    pub title: String,
    pub content: PageContentMigrator,
    pub created_at: String,
    pub updated_at: String,
    pub pinned: bool,
    pub starred: bool,
    pub tags: Option<Vec<String>>,
    pub parent_id: Option<String>,
    pub sub_pages: Vec<String>,
    pub is_in_trash: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NebulaNotebookMigrator {
    pub __id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub created_at: String,
    pub pages: Vec<String>,
    pub page_map: HashMap<String, PageEntryMigrator>,
    pub description: Option<String>,
    pub author: Option<String>,
    pub assets: Vec<String>,
    pub last_accessed_at: String,
    pub is_in_trash: bool,
}
