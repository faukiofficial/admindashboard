const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("id-ID", options).replace(/\./g, "");
  };

  export default formatDate