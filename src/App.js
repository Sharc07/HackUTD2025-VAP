import React, { useState } from 'react';
import { Menu, X, Search, MessageCircle, Home, Car, Settings, Bell, User, Send, ChevronRight } from 'lucide-react';

export default function ToyotaSalesWebsite() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m the Toyota Assistant. How can I help you find your perfect vehicle today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', text: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: 'Thanks for your message! Our team will be happy to assist you shortly.' 
        }]);
      }, 500);
    }
  };

  const vehicles = [
    { name: 'Camry', price: '$28,045', image: '🚗', desc: 'Elegant Sedan' },
    { name: 'RAV4', price: '$30,175', image: '🚙', desc: 'Versatile SUV' },
    { name: 'Corolla', price: '$23,550', image: '🚗', desc: 'Reliable Compact' },
    { name: 'Highlander', price: '$39,520', image: '🚙', desc: 'Spacious SUV' },
  ];

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
        {/* Top Bar */}
        <div className="bg-black border-b-2 border-red-600 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Sales Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" placeholder="Search vehicles..." className="bg-gray-900 border border-red-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500" />
            </div>
            <button className="p-2 hover:bg-red-600 rounded-lg transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-red-600 rounded-lg transition-all">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 mb-8 text-white">
              <h1 className="text-4xl font-bold mb-2">Welcome to Toyota Sales</h1>
              <p className="text-red-100 text-lg">Discover your perfect vehicle from our premium collection</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Vehicles Available', value: '2,450', icon: '🚗' },
                { label: 'Monthly Sales', value: '$1.2M', icon: '📊' },
                { label: 'Customer Satisfaction', value: '98%', icon: '⭐' },
                { label: 'Active Leads', value: '342', icon: '👥' },
              ].map((stat, i) => (
                <div key={i} className="bg-black border-2 border-red-600 rounded-lg p-6 hover:shadow-lg hover:shadow-red-600/50 transition-all">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Featured Vehicles */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Featured Vehicles</h3>
                <button className="text-red-600 hover:text-red-500 flex items-center gap-2">
                  View All <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehicles.map((vehicle, i) => (
                  <div key={i} className="bg-black border-2 border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-all group">
                    <div className="bg-gray-900 h-40 flex items-center justify-center text-6xl group-hover:bg-red-600/20">
                      {vehicle.image}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-white mb-1">{vehicle.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{vehicle.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-bold">{vehicle.price}</span>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
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

      {/* Chatbot */}
      <div className={`fixed bottom-6 right-6 transition-all duration-300 ${chatOpen ? 'w-96' : 'w-16'} z-50`}>
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-red-600/50 transition-all">
            <MessageCircle size={28} />
          </button>
        ) : (
          <div className="bg-black border-2 border-red-600 rounded-xl shadow-2xl flex flex-col h-96 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Toyota Assistant</h4>
                <p className="text-xs text-red-100">Online</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white hover:bg-red-700 p-1 rounded transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-red-600 p-3 bg-black flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type message..."
                className="flex-1 bg-gray-900 border border-red-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
              <button onClick={handleSendMessage} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}