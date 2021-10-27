export default loaders;
declare namespace loaders {
    namespace async {
        export { file as aml };
        export { file as csv };
        export { file as psv };
        export { file as tsv };
        export { file as txt };
        export { file as json };
        export { dbf };
    }
    namespace sync {
        export { fileSync as aml };
        export { fileSync as csv };
        export { fileSync as psv };
        export { fileSync as tsv };
        export { fileSync as txt };
        export { fileSync as json };
    }
}
import file from "./file";
import dbf from "./dbf";
import fileSync from "./fileSync";
