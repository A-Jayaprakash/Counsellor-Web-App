# ACMS Testing Checklist

## 1. Authentication & Authorization

### Student Tests

- [ ] Sign up with valid data
- [ ] Sign up with invalid email format
- [ ] Sign up with weak password (< 8 chars)
- [ ] Sign up with duplicate email
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Login with non-existent email
- [ ] Token persistence (refresh page)
- [ ] Logout functionality

### Counsellor Tests

- [ ] Login as counsellor
- [ ] Access counsellor dashboard
- [ ] Try to access student-only routes
- [ ] Token expiry handling

### Admin Tests

- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] View all system data

---

## 2. Dashboard Testing

### Student Dashboard

- [ ] Attendance percentage displays correctly
- [ ] GPA/CGPA shows correct values
- [ ] Pending OD count is accurate
- [ ] Quick action buttons work
- [ ] Announcements load properly
- [ ] Dashboard refreshes on reload

### Counsellor Dashboard

- [ ] Assigned students count correct
- [ ] Pending OD requests count accurate
- [ ] Today's requests count correct
- [ ] Navigation buttons work

### Admin Dashboard

- [ ] Total users count correct
- [ ] System stats accurate
- [ ] All sections visible

---

## 3. Attendance Module

### View Tests

- [ ] Overall attendance displays correctly
- [ ] Subject-wise breakdown shows
- [ ] Low attendance warning (<75%) appears
- [ ] Progress bars render correctly
- [ ] Last updated date shows
- [ ] Back button works
- [ ] Data matches backend

### Edge Cases

- [ ] Student with no attendance data
- [ ] Student with 0% attendance
- [ ] Student with 100% attendance

---

## 4. Marks Module

### View Tests

- [ ] GPA card displays correctly
- [ ] CGPA card shows accurate value
- [ ] Subject count is correct
- [ ] Marks table renders properly
- [ ] Grade colors are appropriate
- [ ] Percentage calculations correct
- [ ] Back button works

### Edge Cases

- [ ] Student with no marks
- [ ] Failed subjects display
- [ ] Perfect scores (100%)

---

## 5. OD Request Module

### Student Tests - Create

- [ ] Create OD with valid dates
- [ ] Create OD with past dates (should fail)
- [ ] Create OD with end date before start date (should fail)
- [ ] Create OD with short reason (should fail)
- [ ] Create OD with reason > 500 chars (should fail)
- [ ] Success message appears
- [ ] New OD appears in list

### Student Tests - Edit

- [ ] Edit pending OD request
- [ ] Try to edit approved OD (should fail)
- [ ] Try to edit rejected OD (should fail)
- [ ] Update reason successfully
- [ ] Update dates successfully
- [ ] Cancel edit

### Student Tests - Delete

- [ ] Delete pending OD
- [ ] Try to delete approved OD (should fail)
- [ ] Confirm dialog appears
- [ ] Cancel deletion
- [ ] OD removed from list after deletion

### Student Tests - View

- [ ] View OD details dialog
- [ ] See all OD information
- [ ] Status badge correct
- [ ] Counsellor remarks visible (if any)

### Counsellor Tests - Approval

- [ ] View all assigned students' ODs
- [ ] Filter by status (pending/approved/rejected)
- [ ] Open approval dialog
- [ ] Approve with optional remarks
- [ ] Approve without remarks
- [ ] Reject with remarks (required)
- [ ] Try to reject without remarks (should fail)
- [ ] Status updates immediately
- [ ] Student can see updated status

### Filter Tests

- [ ] All tab shows all ODs
- [ ] Pending tab shows only pending
- [ ] Approved tab shows only approved
- [ ] Rejected tab shows only rejected
- [ ] Count badges are correct

---

## 6. Profile Module

### Edit Tests

- [ ] Click edit button
- [ ] Update first name
- [ ] Update last name
- [ ] Update department
- [ ] Email is disabled (can't edit)
- [ ] Role is disabled (can't edit)
- [ ] Save changes successfully
- [ ] Cancel edit reverts changes
- [ ] Changes persist after page reload

---

## 7. UI/UX Testing

### Responsive Design

- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1920px width)
- [ ] All buttons accessible
- [ ] No horizontal scroll
- [ ] Text readable on all sizes

### Loading States

- [ ] Login shows loading spinner
- [ ] Dashboard shows loading
- [ ] Forms show loading on submit
- [ ] Disabled buttons during loading
- [ ] Loading doesn't freeze UI

### Error Handling

- [ ] API errors show alert
- [ ] Network errors handled
- [ ] Invalid token redirects to login
- [ ] Form validation errors visible
- [ ] Error messages are clear

### Navigation

- [ ] Back buttons work
- [ ] Dashboard navigation works
- [ ] Direct URL access works
- [ ] Browser back button works
- [ ] Logout redirects to login

---

## 8. Performance Testing

- [ ] Dashboard loads < 2 seconds
- [ ] OD list loads < 1 second
- [ ] Forms submit < 1 second
- [ ] No console errors
- [ ] No console warnings
- [ ] Smooth transitions
- [ ] No memory leaks

---

## 9. Security Testing

- [ ] Passwords are hidden
- [ ] Tokens stored securely
- [ ] API endpoints require auth
- [ ] Role-based access enforced
- [ ] XSS protection works
- [ ] SQL injection protected
- [ ] CORS configured correctly

---

## 10. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if available)

---

## Bug Report Format

**Bug Title:**
**Steps to Reproduce:**

1.
2.
3.

**Expected Behavior:**
**Actual Behavior:**
**Screenshots:**
**Priority:** High/Medium/Low
