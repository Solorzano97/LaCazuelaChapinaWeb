import { useState } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, Package, ShoppingBag } from 'lucide-react';
import { iaService } from '../services/apiService';

function ChatIA() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de La Cazuela Chapina 🫔. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sugerenciasRapidas = [
    { 
      icon: <ShoppingBag className="w-4 h-4" />,
      text: '¿Qué combo me recomiendas para una familia?',
      action: () => enviarSugerenciaCombo()
    },
    { 
      icon: <TrendingUp className="w-4 h-4" />,
      text: 'Analiza las ventas del último mes',
      action: () => analizarVentas()
    },
    { 
      icon: <Package className="w-4 h-4" />,
      text: 'Optimiza mi inventario',
      action: () => optimizarInventario()
    },
  ];

  const enviarMensaje = async (texto) => {
    if (!texto.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: texto,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await iaService.consulta(texto);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.data.respuesta,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: '❌ Lo siento, hubo un error al procesar tu consulta. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error en chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarSugerenciaCombo = async () => {
    const userMessage = {
      role: 'user',
      content: '¿Qué combo me recomiendas para una familia de 4 personas?',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await iaService.sugerirCombo({
        cantidadPersonas: 4,
        ocasion: 'Comida familiar',
        presupuesto: 200
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.data.sugerencia,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sugiriendo combo:', error);
    } finally {
      setLoading(false);
    }
  };

  const analizarVentas = async () => {
    const userMessage = {
      role: 'user',
      content: 'Analiza las ventas del último mes',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const fechaHasta = new Date();
      const fechaDesde = new Date();
      fechaDesde.setMonth(fechaDesde.getMonth() - 1);

      const response = await iaService.analizarVentas({
        desde: fechaDesde.toISOString(),
        hasta: fechaHasta.toISOString()
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.data.analisis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error analizando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizarInventario = async () => {
    const userMessage = {
      role: 'user',
      content: 'Optimiza mi inventario y dame recomendaciones',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await iaService.optimizarInventario();

      const assistantMessage = {
        role: 'assistant',
        content: response.data.data.optimizacion,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error optimizando inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje(input);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asistente Virtual IA</h1>
              <p className="text-gray-600">Powered by OpenRouter - Respuestas inteligentes</p>
            </div>
          </div>
        </div>

        {/* Sugerencias Rápidas */}
        {messages.length <= 1 && (
          <div className="bg-white px-6 py-4 border-b">
            <p className="text-sm font-medium text-gray-700 mb-3">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {sugerenciasRapidas.map((sugerencia, idx) => (
                <button
                  key={idx}
                  onClick={sugerencia.action}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sugerencia.icon}
                  {sugerencia.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white shadow-lg min-h-[500px] max-h-[600px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`flex-1 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('es-GT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={() => enviarMensaje(input)}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 La IA puede analizar ventas, sugerir combos, optimizar inventario y responder tus preguntas
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatIA;