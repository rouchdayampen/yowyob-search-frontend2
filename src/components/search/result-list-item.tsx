import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/app/search/page';

interface ResultListItemProps {
    item: SearchResult;
    onClick?: (id: string) => void;
}

export const ResultListItem: React.FC<ResultListItemProps> = ({ item, onClick }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => onClick?.(item.id)}
        >
            {/* Image */}
            <div className="flex-shrink-0 w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {item.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 truncate pr-4">
                        {item.name}
                    </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                    {/* Display url-like or source info if available, otherwise just shop name */}
                    https://yowyob.com/all/{item.id}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {item.description}
                </p>

                {/* Footer Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    {item.price && (
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price)}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.shop.address}
                    </span>
                </div>
            </div>
        </div>
    );
};
