const { formatDateTime } = require("../utils/functions");

const buildActionLog = (log) => {
  return {
    adminId: log?.adminId || "",
    action: log?.action || "",
    timestamp: formatDateTime(log?.timestamp) || ""
  };
}

const transformFlaggedContent = (content) => {
  return {
    id: content?.id || "",
    type: content?.type || "",
    content: content?.content || "",
    status: content?.status || "pending",
    flaggedAt: formatDateTime(content?.flaggedAt) || "",
    actions: content?.actions?.map(buildActionLog) || []
  };
};

module.exports = {
  transformFlaggedContent
};
