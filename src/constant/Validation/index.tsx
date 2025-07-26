import { toast } from "react-toastify";

export const validateReceipt = (personName, remarks, items) => {
  let isValid = true;
  const errors = {
    personName: "",
    remarks: "",
    items: [],
  };

  if (!personName.trim()) {
    errors.personName = "Person Name is required";
    isValid = false;
  }

  if (!remarks.trim()) {
    errors.remarks = "Remarks are required";
    isValid = false;
  }

  if (!items.length) {
    errors.items = ["At least one item is required"];
    isValid = false;
  } else {
    items.forEach((item, index) => {
      const itemErrors = {};
      if (!item.itemName?.trim()) {
        itemErrors.itemName = "Required";
        isValid = false;
      }
      if (!item.unit?.trim()) {
        itemErrors.unit = "Required";
        isValid = false;
      }
      if (!item.rate || item.rate <= 0) {
        itemErrors.rate = "Enter valid rate";
        isValid = false;
      }
      if (!item.qty || item.qty <= 0) {
        itemErrors.qty = "Enter valid quantity";
        isValid = false;
      }
      errors.items[index] = itemErrors;
    });
  }

  return { isValid, errors };
};
