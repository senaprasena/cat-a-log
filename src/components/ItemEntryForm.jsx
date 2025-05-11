import { useState } from 'react';

const DEFAULT_TYPES = ['Fruit', 'Vegetable', 'Herb', 'Other', 'Enter a new type...'];

// Simple keyword-based categorization and tagging
const CATEGORY_KEYWORDS = {
  Fruit: ['apple', 'banana', 'orange', 'mango', 'grape', 'melon', 'berry', 'pear', 'peach', 'plum', 'lemon', 'lime', 'pineapple', 'papaya', 'watermelon', 'avocado', 'cherry'],
  Vegetable: ['carrot', 'potato', 'onion', 'lettuce', 'cabbage', 'spinach', 'broccoli', 'pepper', 'tomato', 'cucumber', 'zucchini', 'eggplant', 'radish', 'turnip', 'pumpkin', 'bean', 'pea', 'corn'],
  Herb: ['basil', 'mint', 'cilantro', 'parsley', 'dill', 'rosemary', 'thyme', 'oregano', 'sage', 'chive', 'lemongrass'],
};
const TAG_KEYWORDS = {
  perishable: ['fruit', 'vegetable', 'herb', 'milk', 'cheese', 'yogurt', 'meat', 'fish', 'egg'],
  organic: ['organic', 'bio', 'eco'],
  bulk: ['sack', 'bag', 'bulk', 'crate', 'box'],
  seasonal: ['seasonal', 'summer', 'winter', 'spring', 'autumn', 'fall'],
};

function categorizeAndTag(name, type) {
  const lower = name.toLowerCase();
  // Category
  let category = 'Other';
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(word => lower.includes(word))) {
      category = cat;
      break;
    }
  }
  // If user picked a type, prefer that
  if (type && type !== 'Enter a new type...') category = type;
  // Tags
  const tags = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some(word => lower.includes(word) || (type && type.toLowerCase().includes(word)))) {
      tags.push(tag);
    }
  }
  // Always tag perishable for fruits/veggies/herbs
  if (['Fruit', 'Vegetable', 'Herb'].includes(category) && !tags.includes('perishable')) tags.push('perishable');
  return { category, tags };
}

function ItemEntryForm({ onAddItem }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(DEFAULT_TYPES[0]);
  const [customType, setCustomType] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [supplier, setSupplier] = useState('');
  const [picture, setPicture] = useState('');

  const isCustomType = type === 'Enter a new type...';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate price and amount as numbers
    if (isNaN(price) || isNaN(amount)) {
      alert('Price and Amount must be numbers.');
      return;
    }
    const itemType = isCustomType ? customType : type;
    const { category, tags } = categorizeAndTag(name, itemType);
    const newItem = { name, type: itemType, price, amount, supplier, picture, category, tags };
    if (onAddItem) onAddItem(newItem);
    setName('');
    setType(DEFAULT_TYPES[0]);
    setCustomType('');
    setPrice('');
    setAmount('');
    setSupplier('');
    setPicture('');
  };

  return (
    <form className="item-entry-form" onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Type:</label>
        {isCustomType ? (
          <input
            value={customType}
            onChange={e => setCustomType(e.target.value)}
            placeholder="Enter new type"
            required
          />
        ) : (
          <select value={type} onChange={e => setType(e.target.value)}>
            {DEFAULT_TYPES.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label>Price:</label>
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} required pattern="[0-9.]*" inputMode="decimal" />
      </div>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={e => setAmount(e.target.value)} required pattern="[0-9]*" inputMode="numeric" />
      </div>
      <div>
        <label>Supplier:</label>
        <input value={supplier} onChange={e => setSupplier(e.target.value)} required />
      </div>
      <div>
        <label>Picture:</label>
        <input value={picture} onChange={e => setPicture(e.target.value)} placeholder="Image URL (optional)" />
      </div>
      <button type="submit">Enter</button>
    </form>
  );
}

export default ItemEntryForm; 