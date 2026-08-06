// داده‌های اولیه
const defaultData = {
    chrome: [
        { id: 'c1', name: 'جابجایی به تب بعدی', keys: 'Ctrl + Tab', priority: 1 },
        { id: 'c2', name: 'جابجایی به تب قبلی', keys: 'Ctrl + Shift + Tab', priority: 2 },
        { id: 'c3', name: 'بستن تب فعلی', keys: 'Ctrl + W', priority: 3 },
        { id: 'c4', name: 'باز کردن تب جدید', keys: 'Ctrl + T', priority: 4 },
        { id: 'c5', name: 'باز کردن پنجره ناشناس جدید', keys: 'Ctrl + Shift + N', priority: 5 },
        { id: 'c6', name: 'نمایش/مخفی کردن بوکمارک‌ها', keys: 'Ctrl + Shift + B', priority: 6 },
        { id: 'c7', name: 'باز کردن تاریخچه', keys: 'Ctrl + H', priority: 7 },
        { id: 'c8', name: 'باز کردن دانلودها', keys: 'Ctrl + J', priority: 8 },
        { id: 'c9', name: 'تازه‌سازی صفحه', keys: 'F5 / Ctrl + R', priority: 9 },
        { id: 'c10', name: 'بزرگنمایی', keys: 'Ctrl + +', priority: 10 },
        { id: 'c11', name: 'کوچکنمایی', keys: 'Ctrl + -', priority: 11 },
        { id: 'c12', name: 'بازگشت به صفحه قبل', keys: 'Alt + ←', priority: 12 },
    ],
    windows: [
        { id: 'w1', name: 'تغییر بین پنجرهها', keys: 'Alt + Tab', priority: 1 },
        { id: 'w2', name: 'بستن پنجره فعلی', keys: 'Alt + F4', priority: 2 },
        { id: 'w3', name: 'نمایش دسکتاپ', keys: 'Win + D', priority: 3 },
        { id: 'w4', name: 'باز کردن File Explorer', keys: 'Win + E', priority: 4 },
        { id: 'w5', name: 'باز کردن Settings', keys: 'Win + I', priority: 5 },
        { id: 'w6', name: 'قفل کردن کامپیوتر', keys: 'Win + L', priority: 6 },
        { id: 'w7', name: 'بزرگنمایی صفحه', keys: 'Win + +', priority: 7 },
        { id: 'w8', name: 'چندوظیفهای (Task View)', keys: 'Win + Tab', priority: 8 },
        { id: 'w9', name: 'باز کردن Run', keys: 'Win + R', priority: 9 },
        { id: 'w10', name: 'کپی', keys: 'Ctrl + C', priority: 10 },
        { id: 'w11', name: 'برش', keys: 'Ctrl + X', priority: 11 },
        { id: 'w12', name: 'چسباندن', keys: 'Ctrl + V', priority: 12 },
    ],
    vscode: [
        { id: 'v1', name: 'انتخاب تمام خط', keys: 'Ctrl + L', priority: 1 },
        { id: 'v2', name: 'حذف خط', keys: 'Ctrl + Shift + K', priority: 2 },
        { id: 'v3', name: 'کامنت/آنکامنت', keys: 'Ctrl + /', priority: 3 },
        { id: 'v4', name: 'فرمت خودکار', keys: 'Shift + Alt + F', priority: 4 },
        { id: 'v5', name: 'انتخاب تمام کلمات مشابه', keys: 'Ctrl + D', priority: 5 },
        { id: 'v6', name: 'جایگزینی تمام کلمات مشابه', keys: 'Ctrl + Shift + L', priority: 6 },
        { id: 'v7', name: 'مرتب کردن کد', keys: 'Shift + Alt + F', priority: 7 },
        { id: 'v8', name: 'رفتن به تابع', keys: 'F12', priority: 8 },
    ],
    custom: []
};

// مقداردهی اولیه
let shortcuts = {
    chrome: [],
    windows: [],
    vscode: [],
    custom: []
};

// بارگذاری از storage
function loadData() {
    chrome.storage.local.get(['shortcuts'], function(result) {
        if (result.shortcuts) {
            shortcuts = result.shortcuts;
            // اگر دادههای قدیمی هستند و vscode ندارند، اضافه کن
            if (!shortcuts.vscode) {
                shortcuts.vscode = defaultData.vscode;
                saveData();
            }
        } else {
            shortcuts = JSON.parse(JSON.stringify(defaultData));
            saveData();
        }
        renderAll();
    });
}

// ذخیره در storage
function saveData() {
    chrome.storage.local.set({ shortcuts: shortcuts }, function() {
        // console.log('Data saved');
    });
}

// رندر کردن لیست‌ها
function renderAll() {
    renderList('chrome-list', shortcuts.chrome, 'chrome');
    renderList('windows-list', shortcuts.windows, 'windows');
    renderList('vscode-list', shortcuts.vscode, 'vscode');
    renderList('custom-list', shortcuts.custom, 'custom');
}

function renderList(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `<div style="text-align:center;color:#999;padding:20px;">هیچ میانبری وجود ندارد</div>`;
        return;
    }

    // مرتب‌سازی بر اساس priority
    const sortedItems = [...items].sort((a, b) => a.priority - b.priority);
    
    container.innerHTML = sortedItems.map((item, index) => `
        <div class="shortcut-item" draggable="true" data-id="${item.id}" data-type="${type}" data-index="${index}">
            <span class="drag-handle">⠿</span>
            <div class="shortcut-info">
                <span class="shortcut-name">${item.name}</span>
                <span class="shortcut-keys">${item.keys}</span>
            </div>
            ${type === 'custom' ? `<button class="delete-btn" data-id="${item.id}">✕</button>` : ''}
        </div>
    `).join('');

    // افزودن event listeners برای کشیدن و رها کردن
    const items_el = container.querySelectorAll('.shortcut-item');
    items_el.forEach(el => {
        el.addEventListener('dragstart', dragStart);
        el.addEventListener('dragend', dragEnd);
        el.addEventListener('dragover', dragOver);
        el.addEventListener('dragenter', dragEnter);
        el.addEventListener('dragleave', dragLeave);
        el.addEventListener('drop', drop);
    });

    // دکمه حذف برای آیتم‌های سفارشی
    if (type === 'custom') {
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                deleteCustomShortcut(id);
            });
        });
    }
}

// Drag and Drop
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.shortcut-item').forEach(el => {
        el.classList.remove('drag-over');
    });
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function dragEnter(e) {
    e.preventDefault();
    if (this !== draggedItem) {
        this.classList.add('drag-over');
    }
}

function dragLeave(e) {
    this.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (this !== draggedItem) {
        const type = this.dataset.type;
        const fromId = draggedItem.dataset.id;
        const toId = this.dataset.id;
        
        if (type === 'custom') {
            reorderShortcuts('custom', fromId, toId);
        } else {
            // برای لیست‌های پیش‌فرض فقط اجازه جابجایی اولویت می‌دهیم
            reorderShortcuts(type, fromId, toId);
        }
    }
}

// مرتب‌سازی مجدد
function reorderShortcuts(type, fromId, toId) {
    const list = shortcuts[type];
    const fromIndex = list.findIndex(item => item.id === fromId);
    const toIndex = list.findIndex(item => item.id === toId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    const [movedItem] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, movedItem);
    
    // به‌روزرسانی priority
    list.forEach((item, index) => {
        item.priority = index + 1;
    });
    
    saveData();
    renderAll();
}

// حذف میانبر سفارشی
function deleteCustomShortcut(id) {
    shortcuts.custom = shortcuts.custom.filter(item => item.id !== id);
    saveData();
    renderAll();
}

// افزودن میانبر سفارشی
function addCustomShortcut() {
    const nameInput = document.getElementById('new-shortcut-name');
    const keysInput = document.getElementById('new-shortcut-keys');
    
    const name = nameInput.value.trim();
    const keys = keysInput.value.trim();
    
    if (!name || !keys) {
        alert('لطفاً هر دو فیلد را پر کنید!');
        return;
    }
    
    const newItem = {
        id: 'custom_' + Date.now(),
        name: name,
        keys: keys,
        priority: shortcuts.custom.length + 1
    };
    
    shortcuts.custom.push(newItem);
    nameInput.value = '';
    keysInput.value = '';
    saveData();
    renderAll();
}

// بازنشانی به حالت اولیه
function resetDefaults() {
    if (confirm('آیا مطمئن هستید؟ همه تغییرات شما از دست خواهد رفت!')) {
        shortcuts = JSON.parse(JSON.stringify(defaultData));
        saveData();
        renderAll();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // تغییر تب‌ها
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
    
    // افزودن میانبر سفارشی
    document.getElementById('add-shortcut').addEventListener('click', addCustomShortcut);
    
    // افزودن با کلید Enter
    document.getElementById('new-shortcut-keys').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addCustomShortcut();
    });
    document.getElementById('new-shortcut-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addCustomShortcut();
    });
    
    // بازنشانی
    document.getElementById('reset-defaults').addEventListener('click', resetDefaults);
});