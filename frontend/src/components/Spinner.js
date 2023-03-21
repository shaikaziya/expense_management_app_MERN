import React from 'react';

const Spinner = () => {
    return (
        <div className='justify-content-center'>
            <div className="spinner-border text-dark" style={{ marginLeft: "200px" }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
