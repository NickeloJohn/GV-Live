

const transformStoreBranch = (storeBranch) => {
    return {
        id: storeBranch?._id,
        name: storeBranch?.name,
        type: storeBranch?.type,
        merchantId: storeBranch?.merchantId
    }
}

const transformStoreBranches = (storeBranches) => {
    return storeBranches.map((storeBranch) => transformStoreBranch(storeBranch));
}

module.exports = {
    transformStoreBranch,
    transformStoreBranches
}