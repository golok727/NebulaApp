use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PageContent {
    doctype: String,
    body: String,
    starred: bool,
    pinned: bool,
}

#[derive(Serialize, Deserialize)]
pub struct PageEntry {
    _id_: String,
    title: String,
    content: PageContent,
    sub_pages: Vec<PageEntry>,
}
