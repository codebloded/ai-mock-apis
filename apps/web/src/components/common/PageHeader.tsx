import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';

import { useNavigate } from 'react-router';
import { Button } from '../ui/button';


interface PageHeaderProps {
  title: string;

}

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center mb-4 space-x-4">

      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="">Go Back</span>
      </Button>
      <h1 className="text-2xl font-semibold ">
        {title}
      </h1>
    </div>
  );
}; 
