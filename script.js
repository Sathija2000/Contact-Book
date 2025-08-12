// Contact Book Application
class ContactBook {
    constructor() {
        this.contacts = [];
        this.editingIndex = -1;
        this.initializeEventListeners();
        this.loadFromStorage();
        this.renderContacts();
        this.updateStats();
    }

    initializeEventListeners() {
        // Form submission
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search functionality
        document.getElementById('search').addEventListener('input', () => {
            this.renderContacts();
        });

        // Filter functionality
        document.getElementById('filter-tag').addEventListener('change', () => {
            this.renderContacts();
        });

        // Cancel edit button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.cancelEdit();
        });
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('contact-form'));
        const contact = {
            id: this.editingIndex >= 0 ? this.contacts[this.editingIndex].id : Date.now(),
            name: formData.get('name').trim(),
            phone: formData.get('phone').trim(),
            email: formData.get('email').trim(),
            tag: formData.get('tag') || 'other'
        };

        // Validation
        if (!this.validateContact(contact)) {
            return;
        }

        if (this.editingIndex >= 0) {
            // Update existing contact
            this.contacts[this.editingIndex] = contact;
            this.editingIndex = -1;
            this.resetForm();
            this.showMessage('Contact updated successfully!', 'success');
        } else {
            // Add new contact
            this.contacts.push(contact);
            this.showMessage('Contact added successfully!', 'success');
        }

        this.saveToStorage();
        this.renderContacts();
        this.updateStats();
        document.getElementById('contact-form').reset();
    }

    validateContact(contact) {
        // Check for required fields
        if (!contact.name || !contact.phone || !contact.email) {
            this.showMessage('Please fill all required fields!', 'error');
            return false;
        }

        // Check for duplicate phone (excluding current edit)
        const duplicatePhone = this.contacts.find((c, index) => 
            c.phone === contact.phone && index !== this.editingIndex
        );
        
        if (duplicatePhone) {
            this.showMessage('Phone number already exists!', 'error');
            return false;
        }

        // Check for duplicate email (excluding current edit)
        const duplicateEmail = this.contacts.find((c, index) => 
            c.email === contact.email && index !== this.editingIndex
        );
        
        if (duplicateEmail) {
            this.showMessage('Email already exists!', 'error');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact.email)) {
            this.showMessage('Please enter a valid email address!', 'error');
            return false;
        }

        return true;
    }

    editContact(index) {
        const contact = this.contacts[index];
        this.editingIndex = index;
        
        // Populate form
        document.getElementById('name').value = contact.name;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('email').value = contact.email;
        document.getElementById('tag').value = contact.tag;
        
        // Update UI
        document.getElementById('form-title').textContent = 'Edit Contact';
        document.getElementById('submit-btn').textContent = 'Update Contact';
        document.getElementById('cancel-btn').style.display = 'block';
    }

    deleteContact(index) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts.splice(index, 1);
            this.saveToStorage();
            this.renderContacts();
            this.updateStats();
            this.showMessage('Contact deleted successfully!', 'success');
        }
    }

    cancelEdit() {
        this.editingIndex = -1;
        this.resetForm();
        document.getElementById('contact-form').reset();
    }

    resetForm() {
        document.getElementById('form-title').textContent = 'Add New Contact';
        document.getElementById('submit-btn').textContent = 'Add Contact';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    getFilteredContacts() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const filterTag = document.getElementById('filter-tag').value;

        return this.contacts.filter(contact => {
            const matchesSearch = !searchTerm || 
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.phone.includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm);
            
            const matchesTag = !filterTag || contact.tag === filterTag;
            
            return matchesSearch && matchesTag;
        });
    }

    renderContacts() {
        const container = document.getElementById('contacts-container');
        const filteredContacts = this.getFilteredContacts();

        if (filteredContacts.length === 0) {
            container.innerHTML = '<div class="no-contacts">No contacts found matching your criteria.</div>';
            return;
        }

        // Sort contacts alphabetically by name
        filteredContacts.sort((a, b) => a.name.localeCompare(b.name));

        container.innerHTML = filteredContacts.map((contact, index) => {
            const originalIndex = this.contacts.findIndex(c => c.id === contact.id);
            return `
                <div class="contact-card">
                    <div class="contact-header">
                        <div>
                            <div class="contact-name">${this.escapeHtml(contact.name)}</div>
                            ${contact.tag ? `<span class="contact-tag">${this.escapeHtml(contact.tag)}</span>` : ''}
                        </div>
                    </div>
                    <div class="contact-info">
                        <div><strong>📞 Phone:</strong> ${this.escapeHtml(contact.phone)}</div>
                        <div><strong>📧 Email:</strong> ${this.escapeHtml(contact.email)}</div>
                    </div>
                    <div class="contact-actions">
                        <button class="btn btn-secondary" onclick="app.editContact(${originalIndex})">Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteContact(${originalIndex})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        document.getElementById('total-contacts').textContent = this.contacts.length;
        document.getElementById('friend-count').textContent = this.contacts.filter(c => c.tag === 'friend').length;
        document.getElementById('work-count').textContent = this.contacts.filter(c => c.tag === 'work').length;
        document.getElementById('family-count').textContent = this.contacts.filter(c => c.tag === 'family').length;
    }

    saveToStorage() {
        // Store contacts in localStorage for persistence
        try {
            localStorage.setItem('contactBookData', JSON.stringify(this.contacts));
        } catch (error) {
            console.log('Storage not available, using memory storage');
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('contactBookData');
            if (savedData) {
                this.contacts = JSON.parse(savedData);
            } else {
                // Load sample data if no saved data exists
                this.loadSampleData();
            }
        } catch (error) {
            console.log('Storage not available, loading sample data');
            this.loadSampleData();
        }
    }

    loadSampleData() {
        this.contacts = [
            {
                id: 1,
                name: "John Doe",
                phone: "+1234567890",
                email: "john.doe@example.com",
                tag: "friend"
            },
            {
                id: 2,
                name: "Jane Smith",
                phone: "+0987654321",
                email: "jane.smith@company.com",
                tag: "work"
            },
            {
                id: 3,
                name: "Mom",
                phone: "+1122334455",
                email: "mom@family.com",
                tag: "family"
            }
        ];
    }

    showMessage(message, type) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ContactBook();
});