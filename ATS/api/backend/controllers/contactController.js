import ContactService from '../services/contactService.js';

class ContactController {
  static async createContact(req, res) {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ status: 400, message: 'All fields are required' });
    }

    try {
      const result = await ContactService.createContact({ name, email, message });
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error creating contact:', error);
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
  }
}

export default ContactController;
