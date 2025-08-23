import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import { useAppContext } from '../context/AppContext';
import AgeGateModal from '../components/AgeGateModal';

const KinkyKustomer: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAgeGate, setShowAgeGate] = useState(false);
    const { addToast } = useToast();
    const { isAgeVerified, verifyAge } = useAppContext();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            addToast('You must agree to the submission terms.', 'warning');
            return;
        }
        if (!name || !email || !description) {
            addToast('Please fill out all required fields.', 'warning');
            return;
        }
        
        if (!isAgeVerified) {
            setShowAgeGate(true);
            return;
        }

        setIsLoading(true);
        try {
            await api.submitCustomDesign({ name, email, description, file: file || undefined });
            addToast('Your design idea has been submitted!', 'success');
            // Reset form
            setName('');
            setEmail('');
            setDescription('');
            setFile(null);
            setAgreed(false);
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

        } catch (error) {
            addToast('There was an error submitting your design. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container mx-auto">
            {showAgeGate && (
                <AgeGateModal
                    onVerify={() => {
                        verifyAge();
                        setShowAgeGate(false);
                        addToast("You're verified! Please click 'Submit Design' again.", "info");
                    }}
                    onCancel={() => setShowAgeGate(false)}
                />
            )}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    Kinky Kustomer Creations
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Got a unique idea? A personal touch you want to see on our apparel? Submit your custom design request here and let's create something amazing together!
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                     <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Submit Your Idea</h3>
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Design Idea</label>
                            <textarea id="description" rows={5} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe your vision in detail. What should it look like? What colors? Any text?" required></textarea>
                        </div>
                        <div>
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inspiration (Optional)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {file && <p className="text-xs text-green-500 mt-2">{file.name}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                          <button type="submit" disabled={isLoading || !agreed} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                             {isLoading && <Spinner />}
                             Submit Design
                          </button>
                        </div>
                     </form>
                </div>

                <div className="bg-yellow-50 dark:bg-gray-800 dark:border dark:border-yellow-400/30 p-8 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-900 dark:text-yellow-300">Design Submission Agreement</h3>
                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                       <p>By submitting your design idea ("Submission") through the Kinky Kustomer service, you acknowledge and agree to the following terms:</p>
                        <ol className="list-decimal list-inside space-y-2">
                           <li><strong>Ownership Transfer:</strong> You grant KinkyBrizzle exclusive, perpetual, and irrevocable rights to your Submission. This includes the right to reproduce, modify, display, and sell products featuring your design.</li>
                           <li><strong>Public Use:</strong> KinkyBrizzle reserves the right to publicly display your Submission for marketing, inspiration, or any other commercial purpose.</li>
                           <li><strong>Kustomer Credit Program:</strong> If KinkyBrizzle decides to sell a product based on your Submission, you will receive a small account credit for each unit sold. This credit is a gratuity and not a formal royalty.</li>
                           <li><strong>Credit Discretion:</strong> The amount, terms, and availability of account credits are at the sole discretion of KinkyBrizzle. Credits may be modified or withdrawn at any time, for any reason, without prior notice.</li>
                           <li><strong>No Obligation:</strong> KinkyBrizzle is under no obligation to use your Submission or offer any compensation.</li>
                        </ol>
                        <div className="pt-4">
                             <label className="flex items-center">
                                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <span className="ml-2 text-gray-900 dark:text-gray-100">I have read and agree to the Kinky Kustomer design submission terms.</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KinkyKustomer;