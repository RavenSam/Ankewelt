use rand::{distributions::Alphanumeric, Rng};

#[tauri::command]
pub fn generate_session_token() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(64)
        .map(char::from)
        .collect()
}
