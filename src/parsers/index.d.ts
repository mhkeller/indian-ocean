export default parsers;
declare namespace parsers {
    export { csv };
    export { json };
    export { psv };
    export { tsv };
    export { txt };
    export { aml };
}
import csv from "./csv";
import json from "./json";
import psv from "./psv";
import tsv from "./tsv";
import txt from "./txt";
import aml from "./aml";
