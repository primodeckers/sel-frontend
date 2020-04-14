import api from '../services/api';

export const fetchCargo = async (setData) => {
    const result = await api.get("/cargos");
    setData(result.data);
}

export const fetchEntidade = async (setData) => {
    const result = await api.get("/entidades");
    setData(result.data);
}

export const fetchPessoas = async (setData) => {
    const result = await api.get("/pessoas");
    setData(result.data);
}

export const fetchPessoaForm = async (id, setIndexes, setCounter, setIndexesEnds, setCounterEnds, setIndexesCargos, setCountercargos, setIndexesVinculados, setCounterVinculados, setData, setVinculado, setCargo, setEntidade) => {
    const result = await api.get(`/pessoas/${id}/telefones`).then((res) => {
        res.data.tel_by_pessoa.forEach((item, index) => {
            res.data[`telefones[${index}].id`] = item.id;
            res.data[`telefones[${index}].tip_fone`] = item.tip_fone;
            res.data[`telefones[${index}].num_telefone`] = item.num_telefone;
        });
        setIndexes(() => {
            const arr = [];
            for (let index = 0; index < res.data.tel_by_pessoa.length; index++) {
                arr.push(index);
            }
            return arr;
        });
        setCounter(res.data.tel_by_pessoa.length);
        // setData(res.data);
        return res.data;
    });
    await api.get(`/pessoas/${id}/enderecos`).then((res) => {
        res.data.end_by_pessoa.forEach((item, index) => {
            result[`enderecos[${index}].id`] = item.id;
            result[`enderecos[${index}].tip_end`] = item.tip_end;
            result[`enderecos[${index}].dsc_logradouro`] = item.dsc_logradouro;
        });
        setIndexesEnds(() => {
            const arr = [];
            for (let index = 0; index < res.data.end_by_pessoa.length; index++) {
                arr.push(index);
            }
            return arr;
        });
        setCounterEnds(res.data.end_by_pessoa.length);
        return res.data;
    });
    await api.get(`/entidades-cargos/${id}`).then((res) => {
        const cargos = [];
        const entidades = [];
        res.data.forEach((item, index) => {
            cargos.push({
                id_cargo: item.id_cargo,
                dsc_cargo: item.dsc_cargo
            })
            entidades.push({
                id_entidade: item.id_entidade,
                dsc_entidade: item.dsc_entidade
            })
            result[`cargoEntidade[${index}].id`] = item.id;
        });
        setCargo(cargos);
        setEntidade(entidades);
        setIndexesCargos(() => {
            const arr = [];
            for (let index = 0; index < res.data.length; index++) {
                arr.push(index);
            }
            return arr;
        });
        setCountercargos(res.data.length);
        return res.data;
    });
    await api.get(`/pessoas/${id}/vinculados`).then((res) => {
        setVinculado(res.data);
        // res.data.forEach((item, index) => {
        //     result[`vinculados[${index}].pessoa`] = { value: item.id_filho, label: item.nomefilho };
        //     result[`vinculados[${index}].id`] = item.id;
        // });
        setIndexesVinculados(() => {
            const arr = [];
            for (let index = 0; index < res.data.length; index++) {
                arr.push(index);
            }
            return arr;
        });
        setCounterVinculados(res.data.length);
        return res.data;
    });
    setData(result);
};

export const submitPessoaForm = async (data, id, history, Toast, atualizar, vinculado, cargo, entidade) => {

    const { nom_pessoa, dsc_byname, dsc_email, patente, telefones, enderecos, cargoEntidade, vinculados } = data;

    if (id) {
        api.patch(`/pessoas/${id}`, { nom_pessoa, dsc_byname, dsc_email, patente }).then(async (res) => {
            (telefones || []).map(async item => {
                const id_pessoa = res.data.id;
                const { tip_fone, num_telefone, id } = item;
                if (!id) {
                    await api.post("/telefones", { id_pessoa, tip_fone, num_telefone })
                } else {
                    await api.put(`/telefones/${id}`, { id_pessoa, tip_fone, num_telefone })
                }

            });
            (enderecos || []).map(async item => {

                const id_pessoa = res.data.id;

                const { tip_end, dsc_logradouro, id } = item;
                if (!id) {
                    await api.post("/enderecos", { id_pessoa, tip_end, dsc_logradouro })
                } else {
                    await api.put(`/enderecos/${id}`, { id_pessoa, tip_end, dsc_logradouro })
                }
            });
            (vinculados || []).filter(item => item).map(async (item, index) => {

                const payload = {
                    id_pai: res.data.id,
                    id_pessoa: vinculado[index].id,
                }
                const id = item.id;
                if (!id) {
                    await api.post("/vinculados", payload);
                } else {
                    await api.put(`/vinculados/${id}`, payload);
                }

            });

            (cargoEntidade || []).filter(item => item).map(async (item, index) => {

                const payload = {
                    id_pessoa: res.data.id,
                    id_cargo: cargo[index].id,
                    id_entidade: entidade[index].id,
                }
                const id = item.id;
                if (!id) {
                    await api.post("/entidade-cargo-orgao", payload);
                } else {
                    await api.put(`/entidade-cargo-orgao/${id}`, payload);
                }

            });



            history.push("/contatos");
            Toast.fire({
                icon: 'success',
                title: 'Atualizado com sucesso!'
            })
            atualizar()
        })

            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro inesperado'
                })


            });
    } else {
        api.post("/pessoas", { nom_pessoa, dsc_byname, dsc_email, patente })
            .then(async (res) => {
                (telefones || []).filter(item => item).map(async (item) => {
                    const id_pessoa = res.data.id;
                    const { tip_fone, num_telefone } = item;

                    await api.post("/telefones", { id_pessoa, tip_fone, num_telefone });
                });
                (enderecos || []).filter(item => item).map(async item => {

                    const id_pessoa = res.data.id;
                    const { tip_end, dsc_logradouro } = item;
                    await api.post("/enderecos", { id_pessoa, tip_end, dsc_logradouro });
                });
                (cargoEntidade || []).filter(item => item).map(async (item, index) => {

                    const payload = {
                        id_pessoa: res.data.id,
                        id_cargo: cargo[index].id,
                        id_entidade: entidade[index].id
                    }
                    await api.post("/entidade-cargo-orgao", payload);
                });
                (vinculados || []).filter(item => item).map(async (item, index) => {

                    const payload = {
                        id_pai: res.data.id,
                        id_pessoa: vinculado[index].id,
                    }
                    await api.post("/vinculados", payload);
                });

                history.push("/contatos");
                Toast.fire({
                    icon: 'success',
                    title: 'Salvo com sucesso!'
                });
                atualizar();

            }

            )
    }
}