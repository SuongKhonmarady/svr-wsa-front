import { useState, useEffect } from 'react';
import apiService from '../../../../../services/api';

export function useWaterSupplyForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isStepTransitioning, setIsStepTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState({
        provinces: [],
        districts: [],
        communes: [],
        occupations: [],
        usage_types: []
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service_type: '',
        details: '',
        family_members: '',
        female_members: '',
        village: '',
        commune_id: '',
        district_id: '',
        province_id: '',
        occupation_id: '',
        usage_type_id: ''
    });

    const [privacyAccepted, setPrivacyAccepted] = useState(false);

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

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.getServiceRequestCategories();
                
                if (response.data) {
                    // The API service has already processed the response and extracted the categories
                    // response.data should contain the actual categories data
                    setCategories(response.data);
                } else if (response.error) {
                    console.error('API returned error:', response.error);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Monitor categories state changes
    useEffect(() => {
        if (categories && typeof categories === 'object') {
            // console.log('Categories loaded successfully');
        }
    }, [categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePrivacyChange = (e) => {
        setPrivacyAccepted(e.target.checked);
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
            // Validate all required fields for step 1
            const requiredFields = [
                'name', 'phone', 'service_type', 'family_members', 
                'female_members', 'village', 'commune_id', 'district_id', 
                'province_id', 'occupation_id', 'usage_type_id'
            ];
            
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                setSubmitMessage({
                    type: 'error',
                    text: 'សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់'
                });
                return false;
            }

            // Validate family members count
            if (parseInt(formData.female_members) > parseInt(formData.family_members)) {
                setSubmitMessage({
                    type: 'error',
                    text: 'ចំនួនសមាជិកស្រីមិនអាចច្រើនជាងចំនួនសមាជិកគ្រួសារបានទេ'
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

        if (currentStep === 3) {
            if (!privacyAccepted) {
                setSubmitMessage({
                    type: 'error',
                    text: 'សូមអាន និងយល់ស្របនឹងគោលនយោបាយឯកជនភាពជាមុនសិន។'
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
            // Scroll to top when moving to next step (including step 3)
            scrollToTop();
        }, 300);
    };

    const handlePrevStep = () => {
        setSubmitMessage({ type: '', text: '' });
        setIsStepTransitioning(true);
        
        setTimeout(() => {
            setCurrentStep(prev => prev - 1);
            setIsStepTransitioning(false);
            // Scroll to top when moving to previous step
            scrollToTop();
        }, 400);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            service_type: '',
            details: '',
            family_members: '',
            female_members: '',
            village: '',
            commune_id: '',
            district_id: '',
            province_id: '',
            occupation_id: '',
            usage_type_id: ''
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
        setPrivacyAccepted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        // Final validation before submission
        if (!validateCurrentStep()) {
            setIsSubmitting(false);
            return;
        }

        // Check if privacy policy is accepted
        if (!privacyAccepted) {
            setSubmitMessage({
                type: 'error',
                text: 'សូមអាន និងយល់ស្របនឹងគោលនយោបាយឯកជនភាពជាមុនសិន។'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add form data
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

    // Function to scroll to top of the form
    const scrollToTop = () => {
        // Simple and natural scroll to top
        const formContainer = document.querySelector('.bg-white.py-16');
        
        if (formContainer) {
            formContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            // Simple fallback to window scroll
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
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
        categories,
        privacyAccepted,
        
        // Actions
        handleInputChange,
        handleDocumentChange,
        handleRemoveDocument,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        setIsModalOpen,
        handlePrivacyChange,
        scrollToTop
    };
}
