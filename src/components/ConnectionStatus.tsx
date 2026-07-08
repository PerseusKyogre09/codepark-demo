import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = '',
  showText = true,
}) => {
  const { connectionStatus, connectionError, connect } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          showRetry: false,
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          text: 'Connecting...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          showRetry: false,
          animate: true,
        };
      case 'reconnecting':
        return {
          icon: RefreshCw,
          text: 'Reconnecting...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          showRetry: false,
          animate: true,
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          showRetry: true,
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Connection Error',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          showRetry: true,
        };
      default:
        return {
          icon: WifiOff,
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          showRetry: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} transition-colors`}
        title={connectionError || config.text}
      >
        <Icon
          className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`}
        />
        {showText && (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        )}
      </div>

      {config.showRetry && (
        <button
          onClick={connect}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
          title="Retry connection"
        >
          Retry
        </button>
      )}

      {connectionError && connectionStatus === 'error' && (
        <div className="text-xs text-red-500 max-w-xs truncate" title={connectionError}>
          {connectionError}
        </div>
      )}
    </div>
  );
};
