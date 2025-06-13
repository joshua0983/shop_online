import React from 'react';
import './Item.css';

function Item({ item }) {
    return (
        <div className="item-card">
            <div className="item-image">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-categories">{item.categories}</p>
            </div>
        </div>
    );
}

export default Item;