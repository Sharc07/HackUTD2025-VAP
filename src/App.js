import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Car, Settings, Bell, User, Send, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';

export default function ToyotaSalesWebsite() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [budget, setBudget] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m Yota! How can I help?' }
  ]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const cars = [
    { name: 'Camry', year: 2025, price: '$28,045', desc: 'Elegant Sedan', engine: '2.5L 4-Cylinder', hp: 203, accel: '8.2s', icon: '🚗' },
    { name: 'RAV4', year: 2025, price: '$30,175', desc: 'Versatile SUV', engine: '2.5L 4-Cylinder', hp: 203, accel: '8.5s', icon: '🚙' },
    { name: 'Supra', year: 2025, price: '$45,050', desc: 'Sports Car', engine: '3.0L Turbo', hp: 382, accel: '3.9s', icon: '🏎️' },
  ];

  const handleFindCar = async () => {
    if (!zipCode.trim() || !budget.trim()) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Please enter both ZIP code and budget!' }]);
      return;
    }

    const userMessage = `Find me a car in ZIP code ${zipCode} with a budget of ${budget}`;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, { role: 'user', text: userMessage }] })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI service' }]);
    } finally {
      setLoading(false);
      setZipCode('');
      setBudget('');
    }
  };

  const handleChatSend = async () => {
    if (!chatInputValue.trim()) return;

    const userMessage = chatInputValue;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, { role: 'user', text: userMessage }] })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI service' }]);
    } finally {
      setLoading(false);
    }
  };

  const nextCar = () => setCarouselIndex((prev) => (prev + 1) % cars.length);
  const prevCar = () => setCarouselIndex((prev) => (prev - 1 + cars.length) % cars.length);

  if (currentPage === 'finance') {
    return <FinancePage onBack={() => setCurrentPage('home')} cars={cars} />;
  }

  if (currentPage === 'drive') {
    return <DriveSimulation carName={selectedCar || 'Camry'} onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black border-r-2 border-red-600 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b-2 border-red-600 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold text-red-600">TOYOTA</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-red-600">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          {[
            { icon: <Home size={24} />, label: 'Dashboard' },
            { icon: <Car size={24} />, label: 'Browse Vehicles' },
            { icon: <MessageCircle size={24} />, label: 'Chat Support' },
            { icon: <Bell size={24} />, label: 'Notifications' },
            { icon: <Settings size={24} />, label: 'Settings' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-600 hover:text-white transition-all group">
              <span className="text-gray-400 group-hover:text-white">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-red-600">
          {sidebarOpen && (
            <div className="bg-gray-900 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-red-600">John Dealer</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-black border-b-2 border-red-600 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Sales Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-red-600 rounded-lg transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-red-600 rounded-lg transition-all">
              <User size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Carousel */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Featured Models</h3>
              <div className="relative bg-black border-2 border-red-600 rounded-lg overflow-hidden h-96">
                <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-900 to-black">
                  <div className="text-9xl mb-4">{cars[carouselIndex].icon}</div>
                  <h2 className="text-4xl font-bold text-white">{cars[carouselIndex].year} {cars[carouselIndex].name}</h2>
                  <p className="text-red-600 text-2xl font-bold mt-2">{cars[carouselIndex].price}</p>
                  <p className="text-gray-400 mt-2">{cars[carouselIndex].desc}</p>

                  <button 
                    onClick={() => { setSelectedCar(cars[carouselIndex].name); setCurrentPage('drive'); }}
                    className="absolute bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition-all"
                  >
                    🏎️ Drive Now
                  </button>

                  <button 
                    onClick={() => setCurrentPage('finance')}
                    className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-all"
                  >
                    💰 Finance
                  </button>
                </div>

                <button onClick={prevCar} className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all z-10">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextCar} className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all z-10">
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {cars.map((_, i) => (
                    <button key={i} onClick={() => setCarouselIndex(i)} className={`w-3 h-3 rounded-full transition-all ${i === carouselIndex ? 'bg-red-600 w-8' : 'bg-gray-600'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Vehicles Available', value: '2,450', icon: '🚗' },
                { label: 'Monthly Sales', value: '$1.2M', icon: '📊' },
                { label: 'Customer Satisfaction', value: '98%', icon: '⭐' },
              ].map((stat, i) => (
                <div key={i} className="bg-black border-2 border-red-600 rounded-lg p-6 hover:shadow-lg hover:shadow-red-600/50 transition-all">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="bg-black border-2 border-red-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  'New lead: Sarah Johnson - Interested in RAV4',
                  'Inventory update: 12 new Camry models added',
                  'Customer inquiry: John Smith - Test drive scheduled',
                  'Promotion: Summer sale extended by 2 weeks',
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <p className="text-sm text-gray-300">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yota Chatbot */}
      <div className={`fixed bottom-6 right-6 transition-all duration-300 ${chatOpen ? 'w-96' : 'w-16'} z-50`}>
        {!chatOpen ? (
          <div className="relative group">
            <button onClick={() => setChatOpen(true)} className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-red-600/50 transition-all text-4xl">
              🤖
            </button>
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-black border-2 border-red-600 text-red-600 text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              Talk to Yota for your perfect car match!
            </div>
          </div>
        ) : (
          <div className="bg-black border-2 border-red-600 rounded-xl shadow-2xl flex flex-col h-screen md:h-96 overflow-hidden">
            <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
              <h4 className="font-bold text-white">Yota</h4>
              <button onClick={() => setChatOpen(false)} className="text-white hover:bg-red-700 p-1 rounded transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg text-sm">Yota is thinking...</div></div>}
            </div>

            <div className="border-t border-red-600 p-3 bg-black space-y-3">
              <div className="space-y-2">
                <input type="text" placeholder="ZIP code..." value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full bg-gray-900 border border-red-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none" />
                <input type="text" placeholder="Budget..." value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-gray-900 border border-red-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none" />
                <button onClick={handleFindCar} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 rounded-lg text-sm">Find My Car</button>
              </div>

              <div className="flex gap-2">
                <input type="text" value={chatInputValue} onChange={(e) => setChatInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask Yota..." disabled={loading} className="flex-1 bg-gray-900 border border-red-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                <button onClick={handleChatSend} disabled={loading} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-2 rounded-lg">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FinancePage({ onBack, cars }) {
  const [car1, setCar1] = useState('Camry');
  const [car2, setCar2] = useState('RAV4');
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  const carData = {
    'Camry': {
      price: 28045,
      hp: 203,
      accel: 8.2,
      mpg: 33,
      icon: '🚗',
      pros: ['Excellent fuel economy', 'Spacious interior', 'Reliable brand', 'Comfortable seats'],
      cons: ['Not as sporty', 'Smaller trunk', 'Base model less features'],
    },
    'RAV4': {
      price: 30175,
      hp: 203,
      accel: 8.5,
      mpg: 30,
      icon: '🚙',
      pros: ['Great for families', 'All-wheel drive', 'High resale value', 'Versatile storage'],
      cons: ['Higher price', 'Slower acceleration', 'Moderate fuel economy'],
    },
    'Supra': {
      price: 45050,
      hp: 382,
      accel: 3.9,
      mpg: 24,
      icon: '🏎️',
      pros: ['Powerful engine', 'Sporty performance', 'Luxury interior', 'Eye-catching design'],
      cons: ['Premium price', 'Poor fuel economy', 'Sports handling takes practice'],
    },
  };

  const selectedCar1 = carData[car1];
  const selectedCar2 = carData[car2];

  const calculateMonthlyPayment = (price) => {
    const downPayment = (price * downPaymentPercent) / 100;
    const principal = price - downPayment;
    const monthlyRate = 0.065 / 12;
    const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, 60))) / (Math.pow(1 + monthlyRate, 60) - 1);
    return monthlyPayment.toFixed(2);
  };

  const compareField = (value1, value2, higherIsBetter = true) => {
    if (value1 === value2) return 'tie';
    if (higherIsBetter) return value1 > value2 ? 'car1' : 'car2';
    return value1 < value2 ? 'car1' : 'car2';
  };

  const getWinnerClass = (winner, isFirstCar) => {
    if (winner === 'tie') return 'border-gray-600';
    return (winner === 'car1' && isFirstCar) || (winner === 'car2' && !isFirstCar)
      ? 'border-green-600 bg-green-600/10'
      : 'border-gray-600';
  };

  return (
    <div className="w-full h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      <div className="bg-black border-b-2 border-red-600 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Finance & Compare</h1>
          <p className="text-gray-400 mt-1">Side-by-side vehicle comparison</p>
        </div>
        <button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all">
          ← Back
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-black border-2 border-red-600 rounded-lg p-6">
              <label className="block text-red-600 font-bold mb-3">Vehicle 1</label>
              <select
                value={car1}
                onChange={(e) => setCar1(e.target.value)}
                className="w-full bg-gray-900 border border-red-600 text-white rounded-lg px-4 py-2 focus:outline-none"
              >
                {cars.map((car) => (
                  <option key={car.name} value={car.name}>
                    {car.year} {car.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-black border-2 border-red-600 rounded-lg p-6">
              <label className="block text-red-600 font-bold mb-3">Vehicle 2</label>
              <select
                value={car2}
                onChange={(e) => setCar2(e.target.value)}
                className="w-full bg-gray-900 border border-red-600 text-white rounded-lg px-4 py-2 focus:outline-none"
              >
                {cars.map((car) => (
                  <option key={car.name} value={car.name}>
                    {car.year} {car.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-black border-2 border-red-600 rounded-lg p-6 mb-8">
            <label className="text-red-600 font-bold mb-3 block">Down Payment: {downPaymentPercent}%</label>
            <input
              type="range"
              min="5"
              max="50"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComparisonCard car={car1} data={selectedCar1} other={selectedCar2} compareField={compareField} getWinnerClass={getWinnerClass} downPaymentPercent={downPaymentPercent} calculateMonthlyPayment={calculateMonthlyPayment} isFirst={true} />
            <ComparisonCard car={car2} data={selectedCar2} other={selectedCar1} compareField={compareField} getWinnerClass={getWinnerClass} downPaymentPercent={downPaymentPercent} calculateMonthlyPayment={calculateMonthlyPayment} isFirst={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ car, data, other, compareField, getWinnerClass, downPaymentPercent, calculateMonthlyPayment, isFirst }) {
  return (
    <div className="bg-black border-2 border-red-600 rounded-lg overflow-hidden">
      <div className="bg-red-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{data.icon} {car}</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className={`border-2 rounded-lg p-4 ${getWinnerClass(compareField(data.price, other.price, false), isFirst)}`}>
          <div className="text-gray-400 text-sm">MSRP Price</div>
          <div className="text-2xl font-bold text-red-600">${data.price.toLocaleString()}</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${getWinnerClass(compareField(data.hp, other.hp), isFirst)}`}>
          <div className="text-gray-400 text-sm">Horsepower</div>
          <div className="text-2xl font-bold text-white">{data.hp} HP</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${getWinnerClass(compareField(data.accel, other.accel, false), isFirst)}`}>
          <div className="text-gray-400 text-sm">0-60 Time</div>
          <div className="text-2xl font-bold text-white">{data.accel}s</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${getWinnerClass(compareField(data.mpg, other.mpg), isFirst)}`}>
          <div className="text-gray-400 text-sm">Fuel Economy</div>
          <div className="text-2xl font-bold text-white">{data.mpg} MPG</div>
        </div>

        <div className="border-2 border-blue-600 bg-blue-600/10 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Down Payment</div>
          <div className="text-2xl font-bold text-blue-400">${Math.round((data.price * downPaymentPercent) / 100).toLocaleString()}</div>
        </div>

        <div className="border-2 border-green-600 bg-green-600/10 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Monthly Payment (60 months @ 6.5%)</div>
          <div className="text-3xl font-bold text-green-400">${calculateMonthlyPayment(data.price)}</div>
        </div>

        <div className="border-2 border-green-600 rounded-lg p-4">
          <div className="text-green-600 font-bold mb-2">✅ PROS</div>
          <ul className="text-sm text-gray-300 space-y-1">
            {data.pros.map((pro, i) => (
              <li key={i}>• {pro}</li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-red-600 rounded-lg p-4">
          <div className="text-red-600 font-bold mb-2">❌ CONS</div>
          <ul className="text-sm text-gray-300 space-y-1">
            {data.cons.map((con, i) => (
              <li key={i}>• {con}</li>
            ))}
          </ul>
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all">
          Get Pre-Approved
        </button>
      </div>
    </div>
  );
}

function DriveSimulation({ carName, onBack }) {
  const [speed, setSpeed] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);
  const [distance, setDistance] = useState(0);
  const [season, setSeason] = useState('summer');
  const [isNight, setIsNight] = useState(false);
  const [roadOffset, setRoadOffset] = useState(0);
  const [zipCode, setZipCode] = useState('75080');
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const keysPressed = useRef({});
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (showMap && mapLoaded && mapRef.current) {
      mapRef.current.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      iframe.loading = 'lazy';
      iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=-118.5,33.5,-117.5,34.5&layer=mapnik`;
      mapRef.current.appendChild(iframe);
    }
  }, [showMap, mapLoaded]);

  const carSpecs = {
    'Camry': { engine: '2.5L 4-Cylinder', hp: 203, accel: '8.2s', acceleration: 0.12, maxSpeed: 120 },
    'RAV4': { engine: '2.5L 4-Cylinder', hp: 203, accel: '8.5s', acceleration: 0.11, maxSpeed: 115 },
    'Supra': { engine: '3.0L Turbo', hp: 382, accel: '3.9s', acceleration: 0.35, maxSpeed: 165 },
  };

  const specs = carSpecs[carName] || carSpecs['Camry'];
  const { acceleration, maxSpeed } = specs;

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.value = 0;

    oscillator.type = 'sine';
    oscillator.frequency.value = 100;
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainRef.current = gain;

    return () => {
      oscillator.stop();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (['w', 'arrowup', 's', 'arrowdown'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setThrottle(prev => {
        const isAccelerating = keysPressed.current['w'] || keysPressed.current['arrowup'];
        return isAccelerating ? Math.min(prev + 0.05, 1) : Math.max(prev - 0.08, 0);
      });

      setBrake(prev => {
        const isBraking = keysPressed.current['s'] || keysPressed.current['arrowdown'];
        return isBraking ? Math.min(prev + 0.05, 1) : Math.max(prev - 0.08, 0);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        let newSpeed = prevSpeed;

        if (throttle > 0) {
          newSpeed += throttle * acceleration;
        }

        if (brake > 0) {
          newSpeed -= brake * 0.4;
        }

        newSpeed = Math.max(0, Math.min(newSpeed, maxSpeed));
        newSpeed *= 0.98;

        return newSpeed;
      });

      setDistance(prev => prev + speed * 0.05);
      setRoadOffset(prev => (prev + speed * 0.5) % 200);
    }, 50);

    return () => clearInterval(interval);
  }, [throttle, brake, speed, maxSpeed, acceleration]);

  useEffect(() => {
    if (gainRef.current && oscillatorRef.current) {
      const baseFrequency = 150 + (speed / maxSpeed) * 300;
      oscillatorRef.current.frequency.value = baseFrequency;
      gainRef.current.gain.value = Math.min(speed / maxSpeed * 0.3, 0.3);
    }
  }, [speed, maxSpeed]);

  const getBackgroundGradient = () => {
    const seasonColors = {
      spring: { day: 'from-blue-400 to-green-300', night: 'from-slate-900 to-slate-800' },
      summer: { day: 'from-blue-500 to-yellow-200', night: 'from-slate-900 to-slate-800' },
      fall: { day: 'from-orange-400 to-red-300', night: 'from-slate-900 to-slate-800' },
      winter: { day: 'from-cyan-300 to-blue-200', night: 'from-slate-900 to-slate-800' },
    };
    return seasonColors[season][isNight ? 'night' : 'day'];
  };

  return (
    <div className={`w-full h-screen bg-gradient-to-b ${getBackgroundGradient()} relative overflow-hidden`}>
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-32 bg-white opacity-60"
            style={{
              left: '50%',
              top: `${(i * 25 - roadOffset) % 200}%`,
              transform: 'translateX(-50%)',
            }}
          />
        ))}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-gray-700 opacity-30"></div>
          <div className="w-1/3"></div>
          <div className="flex-1 bg-gray-700 opacity-30"></div>
        </div>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-9xl drop-shadow-2xl">
        {carName === 'Supra' ? '🏎️' : carName === 'RAV4' ? '🚙' : '🚗'}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-auto">
          <button
            onClick={onBack}
            className="bg-black/80 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-black/95 transition-all"
          >
            ← Exit Drive
          </button>

          <div className="flex gap-4">
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="bg-black/80 border border-red-600 text-red-600 px-3 py-2 rounded-lg"
            >
              <option value="spring">Spring 🌸</option>
              <option value="summer">Summer ☀️</option>
              <option value="fall">Fall 🍂</option>
              <option value="winter">Winter ❄️</option>
            </select>

            <button
              onClick={() => setIsNight(!isNight)}
              className="bg-black/80 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-black/95 transition-all"
            >
              {isNight ? '🌙 Night' : '☀️ Day'}
            </button>

            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-black/80 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-black/95 transition-all"
            >
              🗺️ Map
            </button>
          </div>
        </div>

        {showMap && (
          <div className="absolute top-24 right-6 w-80 h-80 bg-black border-2 border-red-600 rounded-lg overflow-hidden pointer-events-auto z-40">
            <div className="p-3 bg-red-600">
              <h3 className="text-white font-bold">Location Map</h3>
            </div>
            <div className="p-3 bg-black/90">
              <input
                type="text"
                placeholder="Enter ZIP code..."
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-gray-900 border border-red-600 text-white rounded px-2 py-1 text-sm mb-2"
              />
              <button
                onClick={() => {
                  setMapLoaded(false);
                  setTimeout(() => setMapLoaded(true), 100);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
              >
                Load Map
              </button>
            </div>
            <div ref={mapRef} className="w-full h-64 bg-gray-800">
              {mapLoaded && (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCZ4-Q0bUw06Jxi2cnyir2irl-rw2sECL4&q=${zipCode}&zoom=16&maptype=satellite`}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
              {!mapLoaded && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Enter ZIP code and click Load Map
                </div>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/90 border-2 border-red-600 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600">{Math.round(speed)}</div>
                <div className="text-gray-400 text-sm">MPH</div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-red-600 h-full transition-all"
                  style={{ width: `${(speed / maxSpeed) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-black/90 border-2 border-red-600 rounded-lg p-6">
              <h3 className="text-red-600 font-bold mb-2">{carName} {new Date().getFullYear()}</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="text-white">{specs.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horsepower:</span>
                  <span className="text-white">{specs.hp} HP</span>
                </div>
                <div className="flex justify-between">
                  <span>0-60:</span>
                  <span className="text-white">{specs.accel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="text-white">{Math.round(distance)} m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-black/90 border-2 border-green-600 rounded-lg p-4">
              <div className="text-xs text-green-600 mb-2">THROTTLE</div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${throttle * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-black/90 border-2 border-red-600 rounded-lg p-4">
              <div className="text-xs text-red-600 mb-2">BRAKE</div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all"
                  style={{ width: `${brake * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-black/90 border-2 border-red-600 rounded-lg p-4 mt-6 text-center">
            <p className="text-gray-300 text-sm">
              <span className="text-red-600 font-bold">W/↑</span> Accelerate | 
              <span className="text-red-600 font-bold"> S/↓</span> Brake
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}