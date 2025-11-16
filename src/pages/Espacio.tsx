import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Espacio = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState<any[]>([]);

  const faqResponses: { [key: string]: string } = {
    precio: 'Los precios van desde $200 MXN para 1 foto hasta $1,000 MXN para fotos familiares. ¡Promoción de Noviembre con 50% de descuento!',
    'como funciona': 'Es muy simple: 1) Sube tus selfies, 2) Selecciona el estudio, 3) Recibe tus fotos en 5-15 minutos.',
    calidad: 'Usamos IA de última generación para crear fotos hiper-realistas en resolución 4K de calidad profesional.',
    tiempo: 'Recibirás tus fotos profesionales en 5-15 minutos dependiendo del paquete seleccionado.',
    navidad: 'El Plan Navideño Especial ($299 MXN) incluye estudios de NYC, cabañas, Santa Claus y paisajes invernales mágicos.',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMsg]);

    // Simple FAQ matching
    const lowerInput = input.toLowerCase();
    let response = '¡Hola! Soy el asistente de Studio Nexora. Te puedo ayudar con preguntas sobre precios, cómo funciona nuestro servicio, calidad, tiempos de entrega, y nuestro plan navideño especial.';

    for (const [keyword, answer] of Object.entries(faqResponses)) {
      if (lowerInput.includes(keyword)) {
        response = answer;
        break;
      }
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMsg]);
    }, 500);

    setInput('');
  };

  return (
    <>
      <Helmet>
        <title>Nuestro Espacio - Studio Nexora</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Studio Nexora</h1>
                <p className="text-gray-400">Descripción de para qué es este espacio y cómo usarlo</p>
              </div>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <span className="text-2xl">👤</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 mt-6 text-sm">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300">
                📁 Agregar archivos
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300">
                🔗 Agregar enlaces
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300">
                ✏️ Añadir instrucciones
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300">
                ✅ Add tasks
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Sidebar - Mis hilos */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  💬 Mis hilos
                </h2>
                <div className="text-gray-400 text-sm">
                  {threads.length === 0 ? 'No hay conversaciones aún' : threads.map(t => (
                    <div key={t.id} className="p-2 hover:bg-gray-800 rounded cursor-pointer">
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1">
              {/* Messages */}
              <div className="mb-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Pregunta cualquier cosa sobre Studio Nexora</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800/50 border border-gray-700 text-gray-100'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Pregunta cualquier cosa sobre Studio Nexora. Escribe / para atajos."
                  className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none"
                  rows={3}
                />

                {/* Toolbar Icons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Buscar">
                      🔍
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Personalizar">
                      🎨
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Ideas">
                      💡
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Traducir">
                      🌐
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Programar">
                      ⏰
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Adjuntar">
                      📎
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Voz">
                      🎤
                    </button>
                  </div>

                  <button
                    onClick={handleSend}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Espacio;
