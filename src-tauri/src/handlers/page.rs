use crate::{
    nebula::{
        current::TrashPage,
        NebulaNotebookFile::{PageEntry, PageSimple},
    },
    state::AppState,
    utils::status::error::{ErrorCode, ErrorResponse},
};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;

#[derive(Serialize, Deserialize)]
pub struct LoadPageResponse {
    page: PageEntry,
    expanded: Vec<String>,
}

#[tauri::command]
pub fn load_page(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
) -> Result<LoadPageResponse, ErrorResponse> {
    let mut state = state.lock().unwrap();

    state.use_notebook(|notebook| {
        let page = notebook.get_page(&page_id)?;
        let expanded = notebook.pages_to_expand(&page.__id);
        let res = LoadPageResponse { page, expanded };
        Ok(res)
    })?
}

#[derive(Serialize, Deserialize)]
pub struct AddPageResponse {
    pages: Vec<PageSimple>,
    new_page_id: String,
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
        let new_page_id = notebook.add_page(title, parent_id, insert_after_id);
        let pages = notebook.get_simple_pages();

        let res = AddPageResponse { pages, new_page_id };
        Ok(res)
    })?
}
#[tauri::command]
pub fn update_page(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
    new_content: String,
) -> Result<String, ErrorResponse> {
    let mut state = state.lock().unwrap();

    state.use_notebook(|notebook| {
        if let Some(page) = notebook.page_map.get_mut(&page_id) {
            page.content.body = new_content.to_owned();
            page.updated_at = Utc::now().to_rfc3339().to_owned();
        }
        Ok(new_content)
    })?
}

#[derive(Serialize)]
pub struct MovePageToTrashResponse {
    pages: Vec<PageSimple>,
    trash_pages: Vec<TrashPage>,
}

#[tauri::command]
pub fn move_page_to_trash(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
) -> Result<MovePageToTrashResponse, ErrorResponse> {
    let mut state = state.lock().unwrap();
    state.use_notebook(|notebook| {
        if let Some(page) = notebook.page_map.get_mut(&page_id) {
            page.add_to_trash();
            notebook.save_to_file()?;
            let res = MovePageToTrashResponse {
                pages: notebook.get_simple_pages(),
                trash_pages: notebook.get_trash_pages(),
            };
            Ok(res)
        } else {
            Err(ErrorResponse::new(
                ErrorCode::NotFoundError,
                "Page not found".to_owned(),
            ))
        }
    })?
}

#[tauri::command]
pub fn recover_page(
    state: State<Arc<Mutex<AppState>>>,
    trash_page_id: String,
) -> Result<Vec<PageSimple>, ErrorResponse> {
    let mut state = state.lock().unwrap();
    state.use_notebook(|notebook| {
        if let Some(page) = notebook.page_map.get_mut(&trash_page_id) {
            if !page.is_in_trash() {
                Err(ErrorResponse::new(
                    ErrorCode::ClientError,
                    "Page not in trash".to_owned(),
                ))
            } else {
                page.remove_from_trash();

                let _ = notebook.save_to_file();
                Ok(notebook.get_simple_pages())
            }
        } else {
            Err(ErrorResponse::new(
                ErrorCode::NotFoundError,
                "Page not found".to_owned(),
            ))
        }
    })?
}

#[tauri::command]
pub fn delete_page_permanently(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
) -> Result<String, ErrorResponse> {
    let mut state = state.lock().unwrap();
    state.use_notebook(|notebook| {
        let deleted_page = notebook.delete_page_permanently(&page_id);
        let _ = notebook.save_to_file();

        deleted_page
    })?
}

#[tauri::command]
pub fn rename_page(
    state: State<Arc<Mutex<AppState>>>,
    page_id: String,
    new_name: String,
) -> Result<String, ErrorResponse> {
    let mut state = state.lock().unwrap();
    state.use_notebook(|notebook| {
        let renamed = notebook.rename_page(&page_id, &new_name);
        let _ = notebook.save_to_file();
        renamed
    })?
}
