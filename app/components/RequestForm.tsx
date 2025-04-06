import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { SiteContent } from '../types/SiteContent';
import { processHtmlContent } from '../utils/processHtmlContent';

type Props = {
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

const RequestForm: React.FC<Props> = ({ setSiteContent, setIsLoading, isLoading }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const scrapeSite = async (url: string) => {
    try {
      const response = await fetch(`/api/scrapper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      const textContent = processHtmlContent(responseData.textContent);
      setSiteContent({ content: textContent, url });
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      openSignUp();
      return;
    }

    if (!siteUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    setIsLoading(true);
    setSiteContent({ url: '', content: '' });

    try {
      await scrapeSite(siteUrl);
    } catch (error) {
      setError('There was an error reading the site. Please try again with a different URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Enter Website URL</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Paste the URL of the website you want to chat with. We'll analyze its content so you can ask questions about it.
      </p>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="url-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Website URL
          </label>
          <input
            id="url-input"
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            name="url-input"
            type="url"
            placeholder="https://example.com"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
          disabled={isLoading || !siteUrl.trim()}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Analyze Website'
          )}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;