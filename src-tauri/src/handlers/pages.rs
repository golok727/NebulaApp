use serde::{Deserialize, Serialize};
const CURRENT_VERSION: u32 = 1;

#[derive(Serialize, Deserialize, Clone)]
pub struct PageContent {
    doctype: String,
    body: String,
    starred: bool,
    pinned: bool,
}
impl PageContent {
    pub fn new() -> Self {
        PageContent {
            doctype: "markdown".to_string(),
            body: "".to_string(),
            pinned: false,
            starred: false,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PageEntry {
    __version__: u32,
    _id_: String,
    title: String,
    tags: Vec<String>,
    content: PageContent,
    sub_pages: Vec<PageEntry>,
}

impl PageEntry {
    pub fn new(title: String) -> Self {
        PageEntry {
            __version__: CURRENT_VERSION,
            _id_: uuid::Uuid::new_v4().to_string(),
            title,
            tags: Vec::new(),
            content: PageContent::new(),
            sub_pages: Vec::new(),
        }
    }
}
