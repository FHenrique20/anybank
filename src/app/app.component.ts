
import { Component, computed, signal } from '@angular/core';
import { BannerComponent } from './componentes/banner/banner.component';
import { FormNovaTransacaoComponent } from './componentes/form-nova-transacao/form-nova-transacao.component';
import { ExtratoComponent } from './componentes/extrato/extrato.component';
import { Transacao, TipoTransacao } from './modelos/transacao';


@Component({
  selector: 'app-root',
  imports: [BannerComponent, FormNovaTransacaoComponent, ExtratoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  transacoes = signal<Transacao[]>([]);

  saldo = computed(() => {
    return this.transacoes().reduce((acc, transacaoAtual) => {
      switch (transacaoAtual.tipo) {
        case TipoTransacao.DEPOSITO:
          return acc + transacaoAtual.valor;

        case TipoTransacao.SAQUE:
          return acc - transacaoAtual.valor;
      
        default:
          throw new Error('Tipo de transação não identificado.');
      }
    }, 0);
  });

  processarTransacao(transacao: Transacao) {
    if (transacao.tipo === TipoTransacao.SAQUE && transacao.valor > this.saldo()) {
      return alert('Saldo insuficiente!');
    }

    this.transacoes.update((listaAtual) => [transacao, ...listaAtual]);
  }
}
