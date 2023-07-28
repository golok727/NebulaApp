use crate::{
    nebula::NebulaNotebookFile::{PageEntry, PageSimple},
    state::AppState,
    utils::status::error::ErrorResponse,
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;
#[tauri::command]
pub fn load_page(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
) -> Result<PageEntry, ErrorResponse> {
    let mut state = state.lock().unwrap();

    state.use_notebook(|notebook| notebook.get_page(&page_id))?
}
#[derive(Serialize, Deserialize)]
pub struct AddPageResponse {
    pages: Vec<PageSimple>,
}
#[tauri::command]
pub fn add_page(
    state: State<Arc<Mutex<AppState>>>,
    title: String,
    parent_id: Option<String>,
    insert_after_id: Option<String>,
) -> Result<AddPageResponse, ErrorResponse> {
    let mut state = state.lock().unwrap();

    state.use_notebook(|notebook| {
        notebook.add_page(title, parent_id, insert_after_id);
        let pages = notebook.get_simple_pages();

        let res = AddPageResponse { pages };
        Ok(res)
    })?
}
