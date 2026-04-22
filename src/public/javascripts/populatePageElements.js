function populateModal(row) {
  document.querySelector('#userModalBody [data-field="name"]').textContent =
    row.dataset.name;
  document.querySelector('#userModalBody [data-field="email"]').textContent =
    row.dataset.email;
  document.querySelector('#userModalBody [data-field="role"]').textContent =
    row.dataset.role;
  document.querySelector('#userModalBody [data-field="status"]').textContent =
    row.dataset.status;
  document.querySelector(
    '#userModalBody [data-field="created-at"]',
  ).textContent = row.dataset.createdAt;
  document.querySelector("#user-profile-button").textContent = row.dataset.name;
  document.querySelector("#modalUserID").value = row.dataset.userid;

  // forms for performing actions
  document.getElementById("banUserForm").action =
    `/admins/ban-user/${row.dataset.userid}`;
  document.getElementById("suspendUserForm").action =
    `/admins/suspend-user/${row.dataset.userid}`;
  document.getElementById("reinstateUserForm").action =
    `/admins/reinstate-user/${row.dataset.userid}`;
  document.getElementById("deleteUserForm").action =
    `/admins/delete-user/${row.dataset.userid}`;
}

function populateDisputeModal(row) {
  document.querySelector(
    '#disputesModalBody [data-field="customer"]',
  ).textContent = row.dataset.customer;
  document.querySelector(
    '#disputesModalBody [data-field="vendor"]',
  ).textContent = row.dataset.vendor;
  document.querySelector(
    '#disputesModalBody [data-field="orderid"]',
  ).textContent = row.dataset.orderid;
  document.querySelector(
    '#disputesModalBody [data-field="createdAt"]',
  ).textContent = row.dataset.createdAt;
  document.querySelector(
    '#disputesModalBody [data-field="total"]',
  ).textContent = row.dataset.total;
  document.querySelector(
    '#disputesModalBody [data-field="status"]',
  ).textContent = row.dataset.status;
  document.querySelector(
    '#disputesModalBody [data-field="description"]',
  ).textContent = row.dataset.description || "No description provided";

  // storing the dispute id for appeal/resolve
  const disputeId = row.dataset.disputeid;
  document.getElementById("resolveDisputeForm").action =
    `/admins/resolve-dispute/${disputeId}`;
  document.getElementById("appealDisputeForm").action =
    `/admins/appeal-dispute/${disputeId}`;
}

function populateApplicationModal(row) {
  document.querySelector('#applicationModal [data-field="name"]').textContent =
    row.dataset.name;
  document.querySelector(
    '#applicationModal [data-field="vendorid"]',
  ).textContent = row.dataset.vendorid;
  document.querySelector(
    '#applicationModal [data-field="userid"]',
  ).textContent = row.dataset.userid;
  document.querySelector(
    '#applicationModal [data-field="address"]',
  ).textContent = row.dataset.address;
  document.querySelector(
    '#applicationModal [data-field="status"]',
  ).textContent = row.dataset.status;

  document.getElementById("rejectAppForm").action =
    `/admins/reject-app/${row.dataset.vendorid}`;
  //document.getElementById('moreInfoAppForm').action = `/admins//${row.dataset.userid}`; // in progress for now
  document.getElementById("approveAppForm").action =
    `/admins/approve-app/${row.dataset.vendorid}`;
}
