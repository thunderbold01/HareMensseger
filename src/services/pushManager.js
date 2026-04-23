/**
 * Push Notification Manager
 * Gerencia notificações push do navegador
 */

class PushNotificationManager {
  constructor() {
    this.swRegistration = null;
    this.vapidPublicKey = 'BEl62iUYgUivxIkv69yViUyTaJTtxJlEhWtxNqKkN6Lx9zV5s0YsPpDMvGqJh0YBKlSMxNVqRk8uE8sGzPxIiMA';
    this.isSubscribed = false;
  }
  
  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('⚠️ Push notifications não suportadas neste navegador');
      return false;
    }
    
    try {
      await this.registerServiceWorker();
      await this.checkSubscription();
      return true;
    } catch (error) {
      console.error('❌ Push init error:', error);
      return false;
    }
  }
  
  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registrado');
      return this.swRegistration;
    } catch (error) {
      console.error('❌ Service Worker falhou:', error);
      throw error;
    }
  }
  
  async checkSubscription() {
    if (!this.swRegistration) return false;
    
    const subscription = await this.swRegistration.pushManager.getSubscription();
    this.isSubscribed = !!subscription;
    console.log(`📱 Push subscription: ${this.isSubscribed ? 'ATIVA' : 'INATIVA'}`);
    return this.isSubscribed;
  }
  
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const subscription = await this.subscribeUser();
        this.isSubscribed = true;
        console.log('✅ Notificações ATIVADAS!');
        return { success: true, subscription };
      } else {
        console.log('❌ Permissão de notificação negada');
        return { success: false, reason: 'denied' };
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      return { success: false, reason: 'error', error };
    }
  }
  
  async subscribeUser() {
    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });
      
      // Enviar subscription para o backend
      await this.sendSubscriptionToServer(subscription);
      
      console.log('✅ Usuário inscrito em push notifications');
      return subscription;
      
    } catch (error) {
      console.error('❌ Erro na subscription:', error);
      return null;
    }
  }
  
  async sendSubscriptionToServer(subscription) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://127.0.0.1:8000/api' 
        : 'https://secure-messaging-api.onrender.com/api';
      
      const response = await fetch(`${apiUrl}/push/save-subscription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(subscription)
      });
      
      if (response.ok) {
        console.log('✅ Subscription salva no servidor');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar subscription:', error);
    }
  }
  
  async unsubscribe() {
    if (!this.swRegistration) return;
    
    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        const token = localStorage.getItem('token');
        if (token) {
          const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://127.0.0.1:8000/api' 
            : 'https://secure-messaging-api.onrender.com/api';
            
          await fetch(`${apiUrl}/push/remove-subscription/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ endpoint: subscription.endpoint })
          });
        }
        
        this.isSubscribed = false;
        console.log('🔕 Desinscrito de push notifications');
      }
    } catch (error) {
      console.error('❌ Erro ao desinscrever:', error);
    }
  }
  
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  async fetchNotifications(unreadOnly = true) {
    const token = localStorage.getItem('token');
    if (!token) return [];
    
    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://127.0.0.1:8000/api' 
        : 'https://secure-messaging-api.onrender.com/api';
      
      const response = await fetch(`${apiUrl}/push/notifications/?unread=${unreadOnly}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.notifications || [];
      }
    } catch (error) {
      console.error('❌ Erro ao buscar notificações:', error);
    }
    
    return [];
  }
}

// Singleton
const pushManager = new PushNotificationManager();
export default pushManager;