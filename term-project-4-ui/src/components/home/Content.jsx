import React, { useEffect, useRef, useState } from 'react';
import Sort from './content/Sort';

export default function Content() {

    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setIsVisible(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={contentRef} className="bg-slate-100 w-[350px] h-screen float-right absolute z-50 -top-[0] -right-[0] p-6">
                <div>
                    <h1 className="text-xl font-medium text-center">Arranging Tasks</h1>
                    <Sort />
                </div>
            </div>
        </div>
    );
}
