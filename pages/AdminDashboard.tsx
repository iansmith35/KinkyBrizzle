import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductForm from '../components/ProductForm';
import OrderTable from '../components/OrderTable';
import { useToast } from '../hooks/useToast';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import ChatBot from '../components/ChatBot';
import ChatBotToggleButton from '../components/ChatBotToggleButton';

// Recharts is loaded from a script tag in index.html
// So we declare it to satisfy TypeScript
declare const Recharts: any;

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const SocialPanel: React.FC = () => {
    const [postContent, setPostContent] = useState('Check out our new Smiley T-Shirt! #KinkyBrizzle #NewArrival');
    const [isPosting, setIsPosting] = useState(false);
    const { addToast } = useToast();

    const handlePost = async () => {
        if (!postContent) {
            addToast('Post content cannot be empty.', 'warning');
            return;
        }
        setIsPosting(true);
        try {
            const result = await api.postToHootsuite(postContent);
            addToast(`Successfully posted to Hootsuite!`, 'success');
            setPostContent('');
        } catch (error) {
            addToast('Failed to post to Hootsuite.', 'error');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Social Poster</h3>
            <div className="space-y-4">
                <textarea
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="What's on your mind?"
                />
                <button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {isPosting && <Spinner />}
                    Post to Hootsuite
                </button>
            </div>
        </div>
    )
}

const QuickLinksPanel: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
        <a 
            href="https://www.printful.com/dashboard/default" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
            Go to Printful Dashboard
            <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </a>
    </div>
)

const SalesChart: React.FC = () => {
    const [isRechartsReady, setIsRechartsReady] = useState(typeof Recharts !== 'undefined');

    useEffect(() => {
        if (isRechartsReady) return;
        const intervalId = setInterval(() => {
            if (typeof Recharts !== 'undefined') {
                setIsRechartsReady(true);
                clearInterval(intervalId);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, [isRechartsReady]);


    if (!isRechartsReady) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Sales</h3>
                <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center">
                     <div role="status" className="flex items-center"><svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg><span className="text-gray-500 dark:text-gray-400">Loading Chart...</span></div>
                </div>
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Sales</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: '#334155', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="sales" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
  const { orders } = useAppContext();
  const [isRebeccaChatOpen, setIsRebeccaChatOpen] = useState(false);

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <SalesChart />
            <OrderTable orders={orders} />
        </div>
        <div className="space-y-8">
            <ProductForm />
            <SocialPanel />
            <QuickLinksPanel />
        </div>
      </div>
      
      <ChatBotToggleButton onClick={() => setIsRebeccaChatOpen(true)} />
       {isRebeccaChatOpen && (
            <ChatBot
              personaName="Rebecca"
              welcomeMessage="Hello! I'm Rebecca, your business management assistant. How can we grow KinkyBrizzle today? Let's talk strategy, products, or marketing."
              systemInstruction="You are Rebecca, an expert e-commerce business manager and strategist for the brand KinkyBrizzle. Your role is to assist the business owner with developing product ideas, analyzing market trends, formulating marketing campaigns, and providing data-driven business advice. Be professional, insightful, and proactive in your suggestions. Use business and marketing terminology where appropriate."
              onClose={() => setIsRebeccaChatOpen(false)}
            />
        )}
    </div>
  );
};

export default AdminDashboard;