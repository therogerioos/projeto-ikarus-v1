package com.ikarus.auth_api.service;

import com.ikarus.auth_api.model.Organizacao;
import com.ikarus.auth_api.model.enums.StatusPagamentoEnum;
import com.ikarus.auth_api.repository.OrganizacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrganizacaoService {

    @Autowired
    private OrganizacaoRepository organizacaoRepository;

    public Organizacao criarOrganizacao(Organizacao org) {
        if (organizacaoRepository.existsByNome(org.getNome())) {
            throw new RuntimeException("Organização com esse nome já existe");
        }

        org.setAtivo(true);
        org.setDataCriacao(LocalDateTime.now());
        org.setStatusPagamento(StatusPagamentoEnum.PENDENTE);
        org.setOrgPausadaPorInadimplencia(false);

        return organizacaoRepository.save(org);
    }

    public List<Organizacao> listarOrganizacoes() {
        return organizacaoRepository.findAll();
    }

    public Organizacao buscarPorId(Long id) {
        return organizacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organização não encontrada"));
    }

    public Organizacao atualizarOrganizacao(Long id, Organizacao orgAtualizada) {
        Organizacao org = buscarPorId(id);

        org.setNome(orgAtualizada.getNome());
        org.setPlano(orgAtualizada.getPlano());
        org.setLimiteUsuarios(orgAtualizada.getLimiteUsuarios());
        org.setLimiteAdministradores(orgAtualizada.getLimiteAdministradores());
        org.setEmailFinanceiro(orgAtualizada.getEmailFinanceiro());

        return organizacaoRepository.save(org);
    }

    public Organizacao atualizarOrganizacaoFinanceiro(Long id, Organizacao orgAtualizada) {
        Organizacao org = buscarPorId(id);

        org.setDataProximaCobranca(orgAtualizada.getDataProximaCobranca());
        org.setDataUltimoPagamento(orgAtualizada.getDataUltimoPagamento());
        org.setStatusPagamento(orgAtualizada.getStatusPagamento());

        return organizacaoRepository.save(org);
    }

    public void pausarOrganizacao(Long id) {
        Organizacao org = buscarPorId(id);
        org.setAtivo(false);
        org.setOrgPausadaPorInadimplencia(true);
        organizacaoRepository.save(org);
    }

    public void ativarOrganizacao(Long id) {
        Organizacao org = buscarPorId(id);
        org.setAtivo(true);
        org.setOrgPausadaPorInadimplencia(false);
        organizacaoRepository.save(org);
    }
}
