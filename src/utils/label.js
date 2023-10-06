export const labelText = (status) => {
  switch (status) {
    case 1:
      return "bg-teal-600";
    case 2:
      return "bg-green-600";
    case 3:
      return "bg-red-400";
    default:
      return "bg-teal-500";
  }
};
