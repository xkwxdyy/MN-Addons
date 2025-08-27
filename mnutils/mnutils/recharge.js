// 全局状态管理
const state = {
    rechargeType: 'existing',
    apiKey: null,
    selectedCredits: null,
    selectedPrice: null,
    isApiKeyVerified: false
};

// DOM 元素
const elements = {
    typeCards: document.querySelectorAll('.type-card'),
    apikeyInput: document.getElementById('apikey-input'),
    apikeyField: document.getElementById('apikey-field'),
    verifyBtn: document.getElementById('verify-btn'),
    apikeyStatus: document.getElementById('apikey-status'),
    creditsSection: document.getElementById('credits-section'),
    creditCards: document.querySelectorAll('.credit-card'),
    orderSummary: document.getElementById('order-summary'),
    summaryType: document.getElementById('summary-type'),
    summaryApikeyItem: document.getElementById('summary-apikey-item'),
    summaryApikey: document.getElementById('summary-apikey'),
    summaryCredits: document.getElementById('summary-credits'),
    summaryPrice: document.getElementById('summary-price'),
    payButton: document.getElementById('pay-button'),
    payInBrowserButton: document.getElementById('pay-button-browser'),
    payButtonMobile: document.getElementById('pay-button-mobile')
};

        /**
         * (手动实现) 根据指定的 scheme、路径和参数生成一个 URL Scheme 字符串。
         * 此版本不使用 URLSearchParams。
         *
         * @param {string} scheme - URL scheme, 例如 'myapp'。
         * @param {string} [path] - 可选的路径或操作名。
         * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
         * @returns {string} - 生成的完整 URL 字符串。
         */
        function generateUrlScheme(scheme, path, params) {
          let url = `${scheme}://${path || ''}`;

          if (params && Object.keys(params).length > 0) {
            const queryParts = [];
            for (const key in params) {
              // 确保我们只处理对象自身的属性
              if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                const type = typeof value
                // 对键和值都进行编码，这是至关重要的！
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(type === "object"? JSON.stringify(value):value);
                queryParts.push(`${encodedKey}=${encodedValue}`);
              }
            }

            if (queryParts.length > 0) {
              url += `?${queryParts.join('&')}`;
            }
          }
          return url;
        }
        function postMessageToAddon(scheme, path, params) {
          let url = generateUrlScheme(scheme,path,params)
          window.location.href = url
        }

// 初始化事件监听器
function initEventListeners() {
    // 充值类型选择
    elements.typeCards.forEach(card => {
        card.addEventListener('click', handleTypeSelection);
    });

    // API Key 验证
    elements.verifyBtn.addEventListener('click', handleApiKeyVerification);
    elements.apikeyField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleApiKeyVerification();
        }
    });

    // 积分选择
    elements.creditCards.forEach(card => {
        card.addEventListener('click', handleCreditSelection);
    });

    // 支付按钮
    elements.payButton.addEventListener('click', handlePayment);
    elements.payInBrowserButton.addEventListener('click', handlePaymentInBrowser);
    elements.payButtonMobile.addEventListener('click', handlePaymentMobile);
}

// 处理充值类型选择
function handleTypeSelection(event) {
    const card = event.currentTarget;
    const type = card.dataset.type;

    // 移除其他卡片的选中状态
    elements.typeCards.forEach(c => c.classList.remove('selected'));
    
    // 添加当前卡片的选中状态
    card.classList.add('selected');
    
    // 更新状态
    state.rechargeType = type;
    // 根据类型显示相应的下一步
    if (type === 'existing') {
        showApiKeyInput();

    } else {
        hideApiKeyInput();
        showCreditsSection();
    }
    
    updateOrderSummary();
}

// 显示 API Key 输入区域
function showApiKeyInput(apiKey) {
    elements.apikeyInput.style.display = 'block';
    elements.creditsSection.style.display = 'none';
    elements.orderSummary.style.display = 'none';
    
    // 重置 API Key 相关状态
    state.isApiKeyVerified = false;
    if (apiKey) {
      state.apiKey = apiKey;
      elements.apikeyField.value = state.apiKey;
    }else if (state.apiKey) {
      elements.apikeyField.value = state.apiKey;
    }else{
      // state.apiKey = null;
      elements.apikeyField.value = '';
    }
    elements.apikeyStatus.style.display = 'none';
    elements.apikeyStatus.className = 'apikey-status';
    if (state.apiKey) {
      handleApiKeyVerification()
    }
}

// 隐藏 API Key 输入区域
function hideApiKeyInput() {
    elements.apikeyInput.style.display = 'none';
    state.isApiKeyVerified = true; // 新 API Key 不需要验证
    showCreditsSection();
}

// 显示积分选择区域
function showCreditsSection() {
    elements.creditsSection.style.display = 'block';
    // console.log("scrollIntoView");
    
    elements.creditsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
    
    // 如果已经选择了积分，更新订单摘要
    if (state.selectedCredits) {
        updateOrderSummary();
    }
}
/**
 * 
 * @param {boolean} success 
 */
function handleApiKeyVerificationResult(success) {
try {

  if (success) {
    // 验证成功
    const apiKey = elements.apikeyField.value.trim();
    state.apiKey = apiKey;
    state.isApiKeyVerified = true;
    showApiKeyStatus('API Key 验证成功！', 'success');
    
    // 显示积分选择区域
    setTimeout(() => {
        showCreditsSection();
    }, 100);
  }else{
        showApiKeyStatus('API Key 验证失败，请检查您的密钥是否正确', 'error');
        state.isApiKeyVerified = false;
  }
  elements.verifyBtn.innerHTML = `<i class="fas fa-check"></i> 验证`;
  elements.verifyBtn.disabled = false;
  
} catch (error) {
        showApiKeyStatus('Error', 'error');
}
}
// 处理 API Key 验证
async function handleApiKeyVerification() {
    const apiKey = elements.apikeyField.value.trim();
    
    if (!apiKey) {
        showApiKeyStatus('请输入API Key', 'error');
        return;
    }
    
    // 显示加载状态
    const originalContent = elements.verifyBtn.innerHTML;
    elements.verifyBtn.innerHTML = '<div class="loading"></div> 验证中...';
    elements.verifyBtn.disabled = true;
    postMessageToAddon("subscription", "verify", {apikey:apiKey})
    
    // try {
    //     // 模拟 API Key 验证（实际项目中应该调用真实的API）
    //     await simulateApiKeyValidation(apiKey);
        
    //     // 验证成功
    //     state.apiKey = apiKey;
    //     state.isApiKeyVerified = true;
    //     showApiKeyStatus('API Key 验证成功！', 'success');
        
    //     // 显示积分选择区域
    //     setTimeout(() => {
    //         showCreditsSection();
    //     }, 100);
        
    // } catch (error) {
    //     // 验证失败
    //     showApiKeyStatus('API Key 验证失败，请检查您的密钥是否正确', 'error');
    //     state.isApiKeyVerified = false;
    // } finally {
    //     // 恢复按钮状态
    //     elements.verifyBtn.innerHTML = originalContent;
    //     elements.verifyBtn.disabled = false;
    // }
}

// 模拟 API Key 验证
function simulateApiKeyValidation(apiKey) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 简单的验证逻辑：API Key 长度大于 10 且包含字母数字
            if (apiKey.length >= 10 && apiKey.startsWith('sk-')) {
                resolve();
            } else {
                reject(new Error('Invalid API Key'));
            }
        }, 200); // 模拟网络延迟
    });
}

// 显示 API Key 状态信息
function showApiKeyStatus(message, type) {
    elements.apikeyStatus.textContent = message;
    elements.apikeyStatus.className = `apikey-status ${type}`;
    elements.apikeyStatus.style.display = 'block';
}

// 处理积分选择
function handleCreditSelection(event) {
    const card = event.currentTarget;
    const credits = parseInt(card.dataset.credits);
    const price = parseInt(card.dataset.price);
    
    // 移除其他卡片的选中状态
    elements.creditCards.forEach(c => c.classList.remove('selected'));
    
    // 添加当前卡片的选中状态
    card.classList.add('selected');
    
    // 更新状态
    state.selectedCredits = credits;
    state.selectedPrice = price;
    
    // 更新并显示订单摘要
    updateOrderSummary();
}

// 更新订单摘要
function updateOrderSummary() {
    // 检查是否有足够的信息显示订单摘要
    const shouldShowSummary = state.rechargeType && state.selectedCredits && 
                              (state.rechargeType === 'new' || state.isApiKeyVerified);
    
    if (!shouldShowSummary) {
        elements.orderSummary.style.display = 'none';
        return;
    }
    
    // 更新摘要内容
    const typeText = state.rechargeType === 'new' ? '购买新的 API Key' : '为现有 API Key 充值';
    elements.summaryType.textContent = typeText;
    
    // 显示/隐藏 API Key 信息
    if (state.rechargeType === 'existing' && state.apiKey) {
        elements.summaryApikeyItem.style.display = 'flex';
        elements.summaryApikey.textContent = maskApiKey(state.apiKey);
    } else {
        elements.summaryApikeyItem.style.display = 'none';
    }
    
    elements.summaryCredits.textContent = `${state.selectedCredits} 积分`;
    elements.summaryPrice.textContent = `¥${state.selectedPrice}`;
    
    // 显示订单摘要
    elements.orderSummary.style.display = 'block';
    
    // 滚动到订单摘要
    elements.orderSummary.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// 掩码 API Key（只显示前4位和后4位）
function maskApiKey(apiKey) {
    if (apiKey.length <= 8) {
        return apiKey;
    }
    const start = apiKey.substring(0, 4);
    const end = apiKey.substring(apiKey.length - 4);
    const mask = '*'.repeat(Math.max(4, apiKey.length - 8));
    return `${start}${mask}${end}`;
}

// 处理支付
async function handlePayment() {
    // 验证订单信息
    if (!validateOrder()) {
        return;
    }
    switch (state.rechargeType) {
      case "existing":
        postMessageToAddon("subscription", "recharge", {credit:state.selectedCredits})
        break;
      case "new":
        postMessageToAddon("subscription", "newkey", {credit:state.selectedCredits})
        break;
    
      default:
        break;
    }
}

// 处理支付
async function handlePaymentInBrowser() {
    // 验证订单信息
    if (!validateOrder()) {
        return;
    }
    switch (state.rechargeType) {
      case "existing":
        postMessageToAddon("subscription", "recharge", {credit:state.selectedCredits,openInBrowser:true})
        break;
      case "new":
        postMessageToAddon("subscription", "newkey", {credit:state.selectedCredits,openInBrowser:true})
        break;
    
      default:
        break;
    }
}
// 处理支付
async function handlePaymentMobile() {
    // 验证订单信息
    if (!validateOrder()) {
        return;
    }
    switch (state.rechargeType) {
      case "existing":
        postMessageToAddon("subscription", "recharge", {credit:state.selectedCredits,openInMobile:true})
        break;
      case "new":
        postMessageToAddon("subscription", "newkey", {credit:state.selectedCredits,openInMobile:true})
        break;
    
      default:
        break;
    }
}

// 验证订单信息
function validateOrder() {
    if (!state.rechargeType) {
        alert('请选择充值类型');
        return false;
    }
    
    if (state.rechargeType === 'existing' && !state.isApiKeyVerified) {
        alert('请先验证您的API Key');
        return false;
    }
    
    if (!state.selectedCredits) {
        alert('请选择充值积分');
        return false;
    }
    
    return true;
}

// 模拟支付处理
function simulatePayment() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% 的概率支付成功
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('支付处理失败，请稍后重试'));
            }
        }, 3000); // 模拟支付处理时间
    });
}

// 显示支付成功
function showPaymentSuccess() {
    const successModal = createModal('success', '支付成功！', 
        `恭喜您成功充值 ${state.selectedCredits} 积分！` +
        (state.rechargeType === 'new' ? '\n您的新API Key将通过邮件发送给您。' : '\n积分已添加到您的账户中。')
    );
    
    document.body.appendChild(successModal);
    
    // 3秒后自动关闭并重置页面
    setTimeout(() => {
        document.body.removeChild(successModal);
        resetPage();
    }, 5000);
}

// 显示支付错误
function showPaymentError(message) {
    const errorModal = createModal('error', '支付失败', message);
    document.body.appendChild(errorModal);
    
    // 3秒后自动关闭
    setTimeout(() => {
        document.body.removeChild(errorModal);
    }, 3000);
}

// 创建模态框
function createModal(type, title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content ${type}">
            <div class="modal-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
    
    // 添加模态框样式
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            animation: slideIn 0.3s ease-out;
        }
        
        .modal-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .modal-content.success .modal-icon {
            color: #28a745;
        }
        
        .modal-content.error .modal-icon {
            color: #dc3545;
        }
        
        .modal-content h3 {
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .modal-content p {
            color: #666;
            line-height: 1.6;
            white-space: pre-line;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    if (!document.querySelector('style[data-modal-styles]')) {
        style.setAttribute('data-modal-styles', '');
        document.head.appendChild(style);
    }
    
    return modal;
}

// 重置页面状态
function resetPage() {
    // 重置状态
    state.rechargeType = null;
    state.apiKey = null;
    state.selectedCredits = null;
    state.selectedPrice = null;
    state.isApiKeyVerified = false;
    
    // 重置UI
    elements.typeCards.forEach(card => card.classList.remove('selected'));
    elements.creditCards.forEach(card => card.classList.remove('selected'));
    elements.apikeyField.value = '';
    elements.apikeyStatus.style.display = 'none';
    
    // 隐藏所有区域，只显示类型选择
    elements.apikeyInput.style.display = 'none';
    elements.creditsSection.style.display = 'none';
    elements.orderSummary.style.display = 'none';
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    
    // 添加一些视觉增强效果
    addVisualEnhancements();
});

// 添加视觉增强效果
function addVisualEnhancements() {
    // 为信用卡添加鼠标悬停效果
    elements.creditCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
    });
    
    // 为类型卡片添加点击波纹效果
    elements.typeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加波纹效果样式
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .type-card {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
} 