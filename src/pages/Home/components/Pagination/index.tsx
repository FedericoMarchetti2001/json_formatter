import React from 'react';

import { Tabs, Tab } from '@mui/material';

export interface IFormatterPaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export default function FormatterPagination(props: IFormatterPaginationProps): React.ReactElement<IFormatterPaginationProps> {

return(
<Tabs value={props.currentPage}>
    <Tab value={1} label="Page One" onClick={() => props.setCurrentPage(1)} />
    <Tab value={2} label="Page Two" onClick={() => props.setCurrentPage(2)} />
    <Tab value={3} label="Page Three" onClick={() => props.setCurrentPage(3)} />
</Tabs>
)}