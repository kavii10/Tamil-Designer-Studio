// IndexedDB + LocalStorage helper for storing course syllabus PDFs

const DB_NAME = 'TamilDesignerStudioPDFs';
const DB_VERSION = 1;
const STORE_NAME = 'syllabus_pdfs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePdfToStorage(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to localStorage if small:', err);
    try {
      if (dataUrl.length < 2_000_000) {
        localStorage.setItem(`tds_pdf_${key}`, dataUrl);
      }
    } catch (lsErr) {
      console.warn('localStorage write failed:', lsErr);
    }
  }
}

export async function getPdfFromStorage(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    const result = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as string) || null);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch (err) {
    console.warn('IndexedDB read failed:', err);
  }

  // Fallback to localStorage
  try {
    return localStorage.getItem(`tds_pdf_${key}`);
  } catch {
    return null;
  }
}

export async function removePdfFromStorage(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore error
  }
  try {
    localStorage.removeItem(`tds_pdf_${key}`);
  } catch {
    // Ignore error
  }
}
