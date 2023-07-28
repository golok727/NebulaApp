use crate::nebula::NebulaNotebookFile::NebulaNotebook;
use crate::utils::status::error::{ErrorCode, ErrorResponse};
pub struct AppState {
    pub notebook: Option<NebulaNotebook>,
}

impl AppState {
    pub fn new() -> Self {
        AppState { notebook: None }
    }
    pub fn set_notebook(&mut self, notebook: NebulaNotebook) {
        self.notebook = Some(notebook);
    }
    pub fn use_notebook<T, F>(&mut self, callback: F) -> Result<T, ErrorResponse>
    where
        F: FnOnce(&mut NebulaNotebook) -> T,
    {
        match &mut self.notebook {
            Some(notebook) => Ok(callback(notebook)),

            _ => Err(ErrorResponse::new(
                ErrorCode::NotebookNotLoadedYet,
                "Notebook Not loaded yet".to_owned(),
            )),
        }
    }
    pub fn unload_notebook(&mut self) -> Result<bool, ErrorResponse> {
        match &self.notebook {
            Some(notebook) => {
                notebook.save_to_file()?;
                self.notebook = None;
                Ok(true)
            }
            _ => Err(ErrorResponse::new(
                ErrorCode::NotebookNotLoadedYet,
                "No Notebook Active to unload".to_owned(),
            )),
        }
    }
}
