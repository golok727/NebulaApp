use crate::{
    nebula::NebulaNotebookFile::PageEntry,
    state::AppState,
    utils::status::error::{ErrorCode, ErrorResponse},
};
use std::sync::{Arc, Mutex};
use tauri::State;

#[tauri::command]
pub fn load_page(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
) -> Result<PageEntry, ErrorResponse> {
    let state = state.lock().unwrap();
    match &state.notebook {
        Some(notebook) => notebook.get_page(&page_id),

        None => Err(ErrorResponse::new(
            ErrorCode::NotebookNotLoadedYet,
            String::from("Notebook not loaded yet"),
        )),
    }
}
