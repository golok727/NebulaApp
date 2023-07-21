use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PageContent {
    doctype: String,
    body: String,
    starred: bool,
    pinned: bool,
    sub_pages: Vec<PageEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct PageEntry {
    _id_: String,
    title: String,
    content: PageContent,
}
