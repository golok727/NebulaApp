use crate::nebula::NebulaNotebookFile::NebulaNotebook;

pub struct AppState {
    pub notebook: Option<NebulaNotebook>,
}

impl AppState {
    pub fn new() -> Self {
        AppState { notebook: None }
    }
}
