import React from 'react';
import { Rating } from '@mui/material';

const StarRating = ({ rating }) => {
    return (
        <Rating
            name="read-only"
            value={rating}
            readOnly
            precision={0.5}
            size="small"
        />
    );
};

export default StarRating;
