import React from 'react';
import './MarketPrices.css';
import NavBar from '../components/NavBar';
import BottomBar from '../components/BottomBar';

const MarketPrices = () => {
  const products = [
    { name: 'Tomatoes', price: '₹2530/qtl', change: '-2.25%', img: '/images/tomatoes.png' },
    { name: 'Okras', price: '₹765/qtl', change: '-1.1%', img: '/images/okras.png' },
    { name: 'Bengal gram', price: '₹5932/qtl', change: '+7.2%', img: '/images/bengalgram.png' },
    { name: 'Cotton', price: '₹7340/qtl', change: '-0.05%', img: '/images/cotton.png' },
    { name: 'Moong dal', price: '₹1240/qtl', change: '+7.7%', img: '/images/moongdal.png' },
    { name: 'Carrots', price: '₹3204/qtl', change: '+1.4%', img: '/images/carrots.png' },
  ];

  return (
    <div className="market-container">
      <NavBar />

      <div className="market-header">
        <h2>Market name:</h2>
        <p>Gollapudi agricultural yard, Vijayawada.</p>
      </div>

      <section className="products-section">
        <h3>Prices in the market</h3>
        <div className="products">
          {products.map((item, index) => (
            <div className="product-card" key={index}>
              <img src={item.img} alt={item.name} />
              <h4>{item.name}</h4>
              <p className="price">{item.price}</p>
              <p className={`change ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <h3>Pie-Chart shares</h3>
          <p>Tomato's shares in this market</p>
          {/* Replace below with actual chart in future */}
          <div className="fake-pie">[Pie Chart Here]</div>
          <div className="chart-details">
            <p><span className="dot red"></span> Low profitable</p>
            <p><span className="dot green"></span> High profitable</p>
            <small>Time: 3:40PM - 5:00PM</small><br />
            <small>Date: 24-08-2022, Wed</small>
          </div>
        </div>

        <div className="chart-card">
          <h3>Bar graph shares</h3>
          <p>Prices in the last 7 days</p>
          <div className="fake-bar">[Bar Graph Here]</div>
        </div>
      </section>
      <BottomBar/>
    </div>
  );
};

export default MarketPrices;
