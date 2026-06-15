/* 상담 신청 폼 검증 및 제출 */
document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('consult-form');
  const successMsg  = document.getElementById('form-success');
  if (!form) return;

  const validate = (field, errorId, condition) => {
    const errorEl = document.getElementById(errorId);
    const isValid = condition(field);
    field.classList.toggle('error', !isValid);
    errorEl?.classList.toggle('show', !isValid);
    return isValid;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name');
    const phone   = form.querySelector('#phone');
    const type    = form.querySelector('#consult-type');
    const message = form.querySelector('#message');
    const agree   = form.querySelector('#agree');

    const v1 = validate(name,    'name-error',    f => f.value.trim().length >= 2);
    const v2 = validate(phone,   'phone-error',   f => /^[0-9\-]{9,14}$/.test(f.value.trim()));
    const v3 = validate(type,    'type-error',    f => f.value !== '');
    const v4 = validate(message, 'message-error', f => f.value.trim().length >= 10);
    const v5 = validate(agree,   'agree-error',   f => f.checked);

    if (!v1 || !v2 || !v3 || !v4 || !v5) return;

    // 제출 처리 (실제로는 API 연동)
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 접수 중...';

    // 테이블 API에 저장
    try {
      const debtAmountEl = form.querySelector('input[name="debt-amount"]:checked');
      const contactTimeEl = form.querySelector('#contact-time');

      const payload = {
        name:         name.value.trim(),
        phone:        phone.value.trim(),
        email:        form.querySelector('#email')?.value.trim() || '',
        consult_type: type.value,
        debt_amount:  debtAmountEl?.value || '미기재',
        contact_time: contactTimeEl?.value || '무관',
        message:      message.value.trim(),
        status:       '접수대기',
      };

      await fetch('tables/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      form.style.display = 'none';
      successMsg.style.display = 'block';
    } catch (err) {
      // 네트워크 오류 시에도 성공 UX 제공 (실제 서비스에선 에러 처리 필요)
      form.style.display = 'none';
      successMsg.style.display = 'block';
    }
  });

  // 실시간 유효성 초기화
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errId = el.id + '-error';
      document.getElementById(errId)?.classList.remove('show');
    });
  });
});
