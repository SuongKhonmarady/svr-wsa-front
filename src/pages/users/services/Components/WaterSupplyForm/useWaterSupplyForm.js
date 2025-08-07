import { useState } from 'react';
import apiService from '../../../../../services/api';

export function useWaterSupplyForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isStepTransitioning, setIsStepTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        service_type: 'Water Supply',
        details: ''
    });

    const [documents, setDocuments] = useState({
        id_card_front: null,
        id_card_back: null,
        family_books: null
    });

    const [documentPreviews, setDocumentPreviews] = useState({
        id_card_front: null,
        id_card_back: null,
        family_books: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];

            // Validate file type (only images)
            if (!file.type.startsWith('image/')) {
                setSubmitMessage({
                    type: 'error',
                    text: 'សូមជ្រើសរើសឯកសាររូបភាពតែប៉ុណ្ណោះ (PNG, JPG, JPEG)'
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSubmitMessage({
                    type: 'error',
                    text: 'ទំហំឯកសារត្រូវតែតិចជាង 5MB'
                });
                return;
            }

            setDocuments(prev => ({
                ...prev,
                [name]: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setDocumentPreviews(prev => ({
                    ...prev,
                    [name]: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            // Clear any error messages
            setSubmitMessage({ type: '', text: '' });
        }
    };

    const handleRemoveDocument = (docType) => {
        setDocuments(prev => ({
            ...prev,
            [docType]: null
        }));
        setDocumentPreviews(prev => ({
            ...prev,
            [docType]: null
        }));

        // Clear file input
        const fileInput = document.querySelector(`input[name="${docType}"]`);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!formData.name || !formData.service_type) {
                setSubmitMessage({
                    type: 'error',
                    text: 'សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់'
                });
                return false;
            }
        }

        if (currentStep === 2) {
            if (!documents.id_card_front || !documents.id_card_back || !documents.family_books) {
                setSubmitMessage({
                    type: 'error',
                    text: 'សូមអាប់ឡូតឯកសារអត្តសញ្ញាណប័ណ្ណ (មុខ និង ក្រោយ) និងសៀវភៅគ្រួសារ'
                });
                return false;
            }
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateCurrentStep()) return;

        setSubmitMessage({ type: '', text: '' });
        setIsStepTransitioning(true);
        
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            setIsStepTransitioning(false);
        }, 300);
    };

    const handlePrevStep = () => {
        setSubmitMessage({ type: '', text: '' });
        setIsStepTransitioning(true);
        
        setTimeout(() => {
            setCurrentStep(prev => prev - 1);
            setIsStepTransitioning(false);
        }, 300);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            service_type: 'Water Supply',
            details: ''
        });
        setDocuments({
            id_card_front: null,
            id_card_back: null,
            family_books: null
        });
        setDocumentPreviews({
            id_card_front: null,
            id_card_back: null,
            family_books: null
        });
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        // Additional validation before submission
        if (!formData.name || !formData.service_type) {
            setSubmitMessage({
                type: 'error',
                text: 'សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់ (ឈ្មោះ និង ប្រភេទសេវាកម្ម)'
            });
            setIsSubmitting(false);
            return;
        }

        if (!documents.id_card_front || !documents.id_card_back || !documents.family_books) {
            setSubmitMessage({
                type: 'error',
                text: 'សូមអាប់ឡូតឯកសារអត្តសញ្ញាណប័ណ្ណ (មុខ និង ក្រោយ) និងសៀវភៅគ្រួសារ'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add form data - include all fields (even empty ones as Laravel expects them)
            Object.keys(formData).forEach(key => {
                const value = formData[key] || '';
                submitData.append(key, value);
            });

            // Add document files in the correct array format
            if (documents.id_card_front && documents.id_card_back) {
                submitData.append('id_card[]', documents.id_card_front);
                submitData.append('id_card[]', documents.id_card_back);
            }

            if (documents.family_books) {
                submitData.append('family_book[]', documents.family_books);
            }

            const response = await apiService.submitServiceRequest(submitData);

            if (response.data && response.data.success) {
                setSubmitMessage({
                    type: 'success',
                    text: response.data.message || 'សំណើសេវាកម្មរបស់អ្នកត្រូវបានដាក់ស្នើដោយជោគជ័យ!'
                });
                setIsModalOpen(true);
                resetForm();
            } else {
                let errorMessage = 'មានបញ្ហាក្នុងការដាក់ស្នើ។ សូមព្យាយាមម្តងទៀត។';

                if (response.error) {
                    errorMessage = response.error;
                } else if (response.data && response.data.errors) {
                    const errorMessages = Object.values(response.data.errors).flat();
                    errorMessage = errorMessages.join(', ');
                } else if (response.data && response.data.message) {
                    errorMessage = response.data.message;
                }

                setSubmitMessage({
                    type: 'error',
                    text: errorMessage
                });
            }
        } catch (error) {
            setSubmitMessage({
                type: 'error',
                text: error.message || 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀត។'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // State
        currentStep,
        isStepTransitioning,
        isSubmitting,
        submitMessage,
        isModalOpen,
        formData,
        documents,
        documentPreviews,
        
        // Actions
        handleInputChange,
        handleDocumentChange,
        handleRemoveDocument,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        setIsModalOpen
    };
}
