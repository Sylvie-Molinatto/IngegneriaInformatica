#include <stdio.h>

typedef struct {
    int type;
    float val;
    long timestamp;
} ValueStruct;
typedef struct {
    int type;
    float val[10];
    long timestamp;
} MValueStruct;
typedef struct {
    int type;
    char message[21]; // stringa null terminated lung max 20
} MessageStruct;
typedef struct {
    int type;
    union {
        ValueStruct val;
        MValueStruct mvals;
        MessageStruct messages;
    };
} ExportData;


void export(ExportData *data, int n, FILE *pf) {
    fwrite(data, sizeof(ExportData),100,pf);
}

int main() {
    ExportData data[100];
    int i = 0;
    for (i = 0; i < 100; i++) {
        /*
        if (i % 2 == 0) {
            ValueStruct v = {1, 1.23, 123456789};
            data[i].type = 1;
            data[i].val = v;
        } else {
            MValueStruct mv = {2, {2.34, 3.45, 4.56}, 123456789};
            data[i].type = 2;
            data[i].mvals = mv;
        }
        */
        if(i<33){
            ValueStruct v = {1, 1.23, 123456789};
            data[i].type = 1;
            data[i].val = v;
        }
        else if(i>=33 && i<66){
            MValueStruct mv = {2, {2.34, 3.45, 4.56}, 123456789};
            data[i].type = 2;
            data[i].mvals = mv;
        }
        else{
            MessageStruct  m = {3,{{'a'},{'b'},{'c'}}};
            data[i].type = 3;
            data[i].messages = m;
        }

    }
    FILE *fp = fopen("data_2.dat", "wb");
    if(fp==NULL){
        perror("Error opening file");
        return -1;
    }
    export(data, 100, fp);
    fclose(fp);
    return 0;
}
