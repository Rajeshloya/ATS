import Contact from '../models/Contact.js';

class ContactService {
  static async createContact(data) {
    try {
      const newContact = new Contact(data);
      await newContact.save();
      return { status: 200, message: 'Contact message saved successfully' };
    } catch (error) {
      console.error('Error saving contact message:', error);
      return { status: 500, message: 'Failed to save contact message' };
    }
  }
}

export default ContactService;
