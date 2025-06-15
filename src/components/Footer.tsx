import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-white py-12 bg-opacity-90">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 justify-center flex-col">
              <div className='flex mb-2'>
              <BookOpen className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold">BookVerse</span>
              </div>
            <p className="text-gray-400 mb-4 text-center">
              Your digital library, personalized and organized.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
            </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} BookVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;